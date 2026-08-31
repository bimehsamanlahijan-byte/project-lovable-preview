import { useEffect, useRef, useState } from "react";
import { RefreshCw, Trash2, Upload, Copy, FolderOpen } from "lucide-react";

type Item = {
  name: string;
  path: string;
  url: string;
  size: number | null;
  mime: string | null;
  createdAt: string | null;
};

const FOLDERS = ["media", "images", "videos", "banners", "branding", "misc"];
const inputCls = "text-xs rounded-lg border border-slate-300 px-2.5 py-2 bg-white";

function human(size: number | null) {
  if (!size) return "-";
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

/** Media library for the site-assets storage bucket: upload, replace, delete, copy URL. */
export function MediaPane() {
  const [folder, setFolder] = useState("media");
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/assets?folder=${encodeURIComponent(folder)}`);
      const json = (await res.json()) as { files?: Item[]; error?: string };
      if (json.error) setMsg(json.error);
      setItems(json.files ?? []);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "خطا در دریافت فهرست فایل‌ها");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folder]);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setMsg("");
    let done = 0;
    for (const file of Array.from(files)) {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", folder);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      if (res.ok) done += 1;
      else setMsg(`آپلود ${file.name} ناموفق بود (${res.status})`);
    }
    setBusy(false);
    if (done) setMsg(`${done} فایل آپلود شد ✓`);
    if (fileRef.current) fileRef.current.value = "";
    void load();
  }

  async function remove(path: string) {
    if (!window.confirm(`حذف قطعی «${path}»؟`)) return;
    setBusy(true);
    const res = await fetch("/api/admin/assets", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ paths: [path] }),
    });
    setBusy(false);
    setMsg(res.ok ? "حذف شد ✓" : "حذف ناموفق بود.");
    void load();
  }

  async function copy(url: string) {
    await navigator.clipboard.writeText(`${window.location.origin}${url}`);
    setMsg("نشانی فایل کپی شد ✓");
  }

  return (
    <div className="space-y-4" dir="rtl">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <FolderOpen className="h-4 w-4 text-slate-500" />
          <select className={inputCls} value={folder} onChange={(e) => setFolder(e.target.value)}>
            {FOLDERS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => void upload(e.target.files)}
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
          >
            <Upload className="h-3.5 w-3.5" /> آپلود عکس / ویدئو
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void load()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 disabled:opacity-50"
          >
            <RefreshCw className="h-3.5 w-3.5" /> بازخوانی
          </button>
          {msg ? <span className="text-xs text-slate-600">{msg}</span> : null}
        </div>
        <p className="text-[11px] leading-5 text-slate-500">
          فایل‌ها در فضای ذخیره‌سازی سایت (باکت <code>site-assets</code>) نگه‌داری می‌شوند. حداکثر حجم:
          عکس ۱۶ مگابایت، ویدئو ۱۰۰ مگابایت. برای استفاده در صفحات، نشانی فایل را کپی کنید.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <div key={it.path} className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="aspect-video bg-slate-100 flex items-center justify-center">
              {it.mime?.startsWith("video/") ? (
                <video src={it.url} controls className="h-full w-full object-cover" />
              ) : (
                <img src={it.url} alt={it.name} loading="lazy" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="p-2.5 space-y-2">
              <p className="truncate text-xs font-bold text-slate-800" title={it.name}>
                {it.name}
              </p>
              <p className="text-[11px] text-slate-500">{human(it.size)}</p>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => void copy(it.url)}
                  className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-300 px-2 py-1.5 text-[11px] font-bold text-slate-700"
                >
                  <Copy className="h-3 w-3" /> کپی نشانی
                </button>
                <button
                  type="button"
                  onClick={() => void remove(it.path)}
                  className="inline-flex items-center justify-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2 py-1.5 text-[11px] font-bold text-red-700"
                >
                  <Trash2 className="h-3 w-3" /> حذف
                </button>
              </div>
            </div>
          </div>
        ))}
        {!items.length && !busy ? (
          <p className="text-xs text-slate-500">در این پوشه فایلی موجود نیست.</p>
        ) : null}
      </div>
    </div>
  );
}
