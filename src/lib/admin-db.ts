import { adminExec } from "./admin.functions";

type Result<T = any> = { data: T; count: number | null; error: { message: string } | null };

type Op = {
  table: string;
  action: "select" | "insert" | "update" | "upsert" | "delete";
  values?: unknown;
  match?: Record<string, unknown>;
  select?: string;
  order?: { column: string; ascending: boolean };
  limit?: number;
  count?: boolean;
  head?: boolean;
  single?: "single" | "maybeSingle" | null;
  onConflict?: string;
};

class Builder implements PromiseLike<Result> {
  private op: Op;
  constructor(op: Op) {
    this.op = op;
  }
  eq(column: string, value: unknown) {
    this.op.match = { ...(this.op.match ?? {}), [column]: value };
    return this;
  }
  order(column: string, opts?: { ascending?: boolean }) {
    this.op.order = { column, ascending: opts?.ascending ?? true };
    return this;
  }
  limit(n: number) {
    this.op.limit = n;
    return this;
  }
  select(columns = "*") {
    this.op.select = columns;
    return this;
  }
  single() {
    this.op.single = "single";
    return this;
  }
  maybeSingle() {
    this.op.single = "maybeSingle";
    return this;
  }
  async run(): Promise<Result> {
    try {
      return (await adminExec({ data: this.op as never })) as Result;
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      return { data: null, count: null, error: { message } };
    }
  }
  then<A = Result, B = never>(
    onfulfilled?: ((value: Result) => A | PromiseLike<A>) | null,
    onrejected?: ((reason: unknown) => B | PromiseLike<B>) | null,
  ): PromiseLike<A | B> {
    return this.run().then(onfulfilled, onrejected);
  }
}

/**
 * Password-gated admin data access.
 * Mirrors the small subset of the supabase client API the dashboard uses,
 * but every call runs server-side behind the dashboard session cookie.
 */
export function adminDb(table: string) {
  return {
    select(columns = "*", opts?: { count?: "exact"; head?: boolean }) {
      return new Builder({
        table,
        action: "select",
        select: columns,
        count: opts?.count === "exact",
        head: opts?.head ?? false,
      });
    },
    insert(values: unknown) {
      return new Builder({ table, action: "insert", values });
    },
    upsert(values: unknown, opts?: { onConflict?: string }) {
      return new Builder({ table, action: "upsert", values, onConflict: opts?.onConflict });
    },
    update(values: unknown) {
      return new Builder({ table, action: "update", values });
    },
    delete() {
      return new Builder({ table, action: "delete" });
    },
  };
}

export async function adminReadSetting<T>(key: string, fallback: T): Promise<T> {
  const res = await adminDb("site_settings").select("value").eq("key", key).maybeSingle();
  const value = (res.data as { value?: unknown } | null)?.value;
  if (!value) return fallback;
  return { ...fallback, ...(value as object) } as T;
}

export async function adminWriteSetting(key: string, value: unknown) {
  const res = await adminDb("site_settings").upsert(
    { key, value, updated_at: new Date().toISOString() },
    { onConflict: "key" },
  );
  const { notifySaved, notifyFailed } = await import("./notify");
  const err = (res as { error?: { message?: string } } | null)?.error;
  if (err) notifyFailed("تغییرات", err.message);
  else {
    notifySaved("تغییرات");
    void autoPushToGithub(key);
  }
  return res;
}

/** Mirrors the saved content to the default GitHub repo when auto-sync is on. */
async function autoPushToGithub(changedKey: string) {
  try {
    const { GITHUB_SETTING_KEY, DEFAULT_GITHUB_SYNC } = await import("./site-config");
    if (changedKey === GITHUB_SETTING_KEY) return;
    const cfg = await adminReadSetting(GITHUB_SETTING_KEY, DEFAULT_GITHUB_SYNC);
    if (!cfg.autoSync) return;
    const acc = cfg.accounts.find((a) => a.isDefault) ?? cfg.accounts[0];
    if (!acc?.owner || !acc.repo) return;

    const { githubPublishSnapshot } = await import("./github.functions");
    const res = await githubPublishSnapshot({
      data: {
        secretName: acc.secretName,
        owner: acc.owner,
        repo: acc.repo,
        branch: acc.branch,
        path: acc.path,
        note: `به‌روزرسانی خودکار از پیشخوان (${changedKey})`,
      },
    });
    const { notifySaved, notifyFailed } = await import("./notify");
    if (res.ok) notifySaved("ارسال خودکار به گیت‌هاب");
    else notifyFailed("ارسال خودکار به گیت‌هاب", res.error);
  } catch {
    /* auto-sync must never break a dashboard save */
  }
}
