import { adminDb, adminReadSetting, adminWriteSetting } from "@/lib/admin-db";
import { useEffect, useState } from "react";
import { Plus, Save, Trash2, RefreshCw } from "lucide-react";
import {
  DEFAULT_SOCIAL_LAYOUT,
  SOCIAL_PLATFORMS,
      type SocialLayout,
  type SocialLink,
} from "@/lib/site-config";
import { SocialBar } from "@/components/SocialBar";
import { SocialIcon } from "@/components/SocialIcon";

const inputCls = "w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white";

export function SocialPane() {
  const [rows, setRows] = useState<SocialLink[]>([]);
  const [layout, setLayout] = useState<SocialLayout>(DEFAULT_SOCIAL_LAYOUT);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [nonce, setNonce] = useState(0);

  async function load() {
    const [{ data }, cfg] = await Promise.all([
      adminDb("social_links").select("*").order("position", { ascending: true }),
      adminReadSetting<SocialLayout>("social_layout", DEFAULT_SOCIAL_LAYOUT),
    ]);
    setRows((data ?? []) as SocialLink[]);
    setLayout(cfg);
  }
  useEffect(() => {
    void load();
  }, []);

  function patch(id: string, p: Partial<SocialLink>) {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, ...p } : x)));
  }

  async function addRow() {
    const { data, error } = await adminDb("social_links")
      .insert({
        platform: "telegram",
        label: "تلگرام",
        username: "@azarakhsh",
        url: "https://t.me/azarakhsh",
        icon_key: "telegram",
        size_px: 36,
        position: rows.length + 1,
        is_active: true,
      })
      .select()
      .single();
    if (!error && data) setRows((r) => [...r, data as SocialLink]);
  }

  async function saveAll() {
    setBusy(true);
    setMsg("");
    const results = await Promise.all(
      rows.map((r) =>
        adminDb("social_links")
          .update({
            platform: r.platform,
            label: r.label,
            username: r.username,
            url: r.url,
            icon_key: r.icon_key,
            custom_icon_url: r.custom_icon_url,
            size_px: r.size_px,
            position: r.position,
            is_active: r.is_active,
          })
          .eq("id", r.id),
      ),
    );
    const cfg = await adminWriteSetting("social_layout", layout);
    setBusy(false);
    const failed = results.some((r) => r.error) || cfg.error;
    setMsg(failed ? "ذخیره برخی موارد انجام نشد." : "با موفقیت ذخیره شد ✓");
    setNonce((n) => n + 1);
  }

  async function remove(id: string) {
    await adminDb("social_links").delete().eq("id", id);
    setRows((r) => r.filter((x) => x.id !== id));
    setNonce((n) => n + 1);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0b1e3f]">شبکه‌های اجتماعی فوتر</h1>
          <p className="text-sm text-slate-500 mt-1">
            افزودن، حذف، تغییر نام کاربری، اندازه لوگو و نوع چینش برای هر شبکه.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => void load()} className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-white border border-slate-200">
            <RefreshCw className="w-4 h-4" /> بازخوانی
          </button>
          <button onClick={() => void addRow()} className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-[#0b1e3f] text-white">
            <Plus className="w-4 h-4" /> شبکه جدید
          </button>
          <button onClick={() => void saveAll()} disabled={busy} className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-emerald-600 text-white disabled:opacity-50">
            <Save className="w-4 h-4" /> ذخیره همه
          </button>
        </div>
      </div>
      {msg && <div className="mb-4 text-xs bg-white border border-slate-200 rounded-xl p-3">{msg}</div>}

      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 grid sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">نوع چینش</span>
          <select value={layout.layout} onChange={(e) => setLayout({ ...layout, layout: e.target.value as SocialLayout["layout"] })} className={inputCls}>
            <option value="row">ردیفی</option>
            <option value="grid">شبکه‌ای</option>
            <option value="column">ستونی</option>
          </select>
        </label>
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">تراز</span>
          <select value={layout.align} onChange={(e) => setLayout({ ...layout, align: e.target.value as SocialLayout["align"] })} className={inputCls}>
            <option value="start">راست‌چین</option>
            <option value="center">وسط</option>
            <option value="end">چپ‌چین</option>
          </select>
        </label>
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">فاصله (px)</span>
          <input type="number" value={layout.gap} onChange={(e) => setLayout({ ...layout, gap: Number(e.target.value) })} className={inputCls} />
        </label>
        <label className="text-xs">
          <span className="block font-bold text-slate-600 mb-1">شکل لوگو</span>
          <select value={layout.shape} onChange={(e) => setLayout({ ...layout, shape: e.target.value as SocialLayout["shape"] })} className={inputCls}>
            <option value="circle">دایره</option>
            <option value="rounded">گرد</option>
            <option value="square">مربع</option>
          </select>
        </label>
        <label className="text-xs flex items-end gap-2">
          <input type="checkbox" checked={layout.showLabels} onChange={(e) => setLayout({ ...layout, showLabels: e.target.checked })} />
          <span className="font-bold text-slate-600">نمایش نام شبکه</span>
        </label>
        <label className="text-xs flex items-end gap-2">
          <input type="checkbox" checked={layout.showUsernames} onChange={(e) => setLayout({ ...layout, showUsernames: e.target.checked })} />
          <span className="font-bold text-slate-600">نمایش نام کاربری</span>
        </label>
      </div>

      <div className="bg-[#0b1e3f] rounded-2xl p-5 mb-6 text-white">
        <div className="text-xs font-bold mb-3 opacity-80">پیش‌نمایش فوتر</div>
        <SocialBar key={nonce} />
      </div>

      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl border border-slate-200 p-4 grid md:grid-cols-12 gap-3 items-end">
            <div className="md:col-span-1 flex justify-center pb-1">
              <SocialIcon platform={r.platform} iconKey={r.icon_key} customIconUrl={r.custom_icon_url} size={r.size_px} shape={layout.shape} label={r.label} />
            </div>
            <label className="md:col-span-2 text-xs">
              <span className="block font-bold text-slate-600 mb-1">شبکه</span>
              <select
                value={r.platform}
                onChange={(e) => {
                  const p = SOCIAL_PLATFORMS.find((x) => x.value === e.target.value);
                  patch(r.id, { platform: e.target.value, icon_key: e.target.value, label: p?.label ?? r.label });
                }}
                className={inputCls}
              >
                {SOCIAL_PLATFORMS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </label>
            <label className="md:col-span-2 text-xs">
              <span className="block font-bold text-slate-600 mb-1">عنوان نمایشی</span>
              <input value={r.label} onChange={(e) => patch(r.id, { label: e.target.value })} className={inputCls} />
            </label>
            <label className="md:col-span-2 text-xs">
              <span className="block font-bold text-slate-600 mb-1">نام کاربری</span>
              <input dir="ltr" value={r.username ?? ""} onChange={(e) => patch(r.id, { username: e.target.value })} className={inputCls} />
            </label>
            <label className="md:col-span-2 text-xs">
              <span className="block font-bold text-slate-600 mb-1">لینک</span>
              <input dir="ltr" value={r.url} onChange={(e) => patch(r.id, { url: e.target.value })} className={inputCls} />
            </label>
            <label className="md:col-span-1 text-xs">
              <span className="block font-bold text-slate-600 mb-1">اندازه</span>
              <input type="number" min={16} max={96} value={r.size_px} onChange={(e) => patch(r.id, { size_px: Number(e.target.value) })} className={inputCls} />
            </label>
            <label className="md:col-span-1 text-xs">
              <span className="block font-bold text-slate-600 mb-1">ترتیب</span>
              <input type="number" value={r.position} onChange={(e) => patch(r.id, { position: Number(e.target.value) })} className={inputCls} />
            </label>
            <div className="md:col-span-1 flex items-center justify-between gap-2">
              <label className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
                <input type="checkbox" checked={r.is_active} onChange={(e) => patch(r.id, { is_active: e.target.checked })} /> فعال
              </label>
              <button onClick={() => void remove(r.id)} className="p-2 rounded-lg text-rose-600 hover:bg-rose-50" aria-label="حذف">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <label className="md:col-span-12 text-xs">
              <span className="block font-bold text-slate-600 mb-1">آدرس لوگوی سفارشی (اختیاری)</span>
              <input dir="ltr" value={r.custom_icon_url ?? ""} onChange={(e) => patch(r.id, { custom_icon_url: e.target.value })} placeholder="https://..." className={inputCls} />
            </label>
          </div>
        ))}
        {rows.length === 0 && <div className="text-sm text-slate-500 bg-white rounded-2xl p-8 text-center">هنوز شبکه‌ای اضافه نشده است.</div>}
      </div>
    </div>
  );
}
