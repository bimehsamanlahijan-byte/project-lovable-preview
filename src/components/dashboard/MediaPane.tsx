import { useEffect, useRef, useState } from "react";
import { RefreshCw, Trash2, Upload, Copy, FolderOpen, Check } from "lucide-react";

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

/** Uploads one file with a real progress percentage. */
function uploadOne(
  file: File,
  folder: string,
  onProgress: (percent: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("file", file);
    form.append("folder", folder);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/upload");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve();
      } else reject(new Error(`${xhr.status}`));
    };
    xhr.onerror = () => reject(new Error("network"));
    xhr.send(form);
  });
}

/** Media library for the site-assets storage bucket: upload, replace, delete, copy URL. */
export function MediaPane() {
  const [folder, setFolder] = useState("media");
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [copiedPath, setCopiedPath] = useState("");
  const [progress, setProgress] = useState<{ name: string; index: number; total: number; percent: number; stage: string } | null>(null);
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
    const list = Array.from(files);
    setBusy(true);
    setMsg("");
    let done = 0;
    for (let i = 0; i < list.length; i += 1) {
      const file = list[i]!;
      setProgress({ name: file.name, index: i + 1, total: list.length, percent: 0, stage: "در حال آپلود…" });
      try {
        await uploadOne(file, folder, (percent) =>
          setProgress({
            name: file.name,
            index: i + 1,
            total: list.length,
            percent,
            stage: percent < 100 ? "در حال آپلود…" : "در حال ذخیره در فضای سایت…",
          }),
        );
        done += 1;
      } catch (e) {
        setMsg(`آپلود ${file.name} ناموفق بود (${e instanceof Error ? e.message : "خطا"})`);
      }
    }
    setProgress(null);
    setBusy(false);
    if (done) setMsg(`${done} فایل با موفقیت ذخیره شد ✓`);
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

  async function copy(it: Item) {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${it.url}`);
      setCopiedPath(it.path);
      setMsg("کپی با موفقیت انجام شد ✓");
      window.setTimeout(() => setCopiedPath(""), 2000);
    } catch {
      setMsg("کپی انجام نشد؛ نشانی را دستی انتخاب کنید.");
    }
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
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
          >
            <Upload className="h-3.5 w-3.5" /> آپلود عکس / ویدئو
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void load()}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 disabled:opacity-50"
          >
            <RefreshCw className="h-3.5 w-3.5" /> بازخوانی
          </button>
          {msg ? <span className="text-xs font-bold text-slate-600">{msg}</span> : null}
        </div>

        {progress ? (
          <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3">
            <div className="mb-1.5 flex items-center justify-between gap-2 text-[11px] font-bold text-blue-800">
              <span className="truncate">
                فایل {progress.index} از {progress.total} — {progress.name}
              </span>
              <span className="tabular-nums">{progress.percent}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-blue-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-[width] duration-200"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
            <p className="mt-1.5 text-[10px] text-blue-700">{progress.stage}</p>
          </div>
        ) : null}

        <p className="text-[11px] leading-5 text-slate-500">
          فایل‌ها در فضای ذخیره‌سازی سایت (باکت <code>site-assets</code>) نگه‌داری می‌شوند. حداکثر حجم:
          عکس ۱۶ مگابایت، ویدئو ۱۰۰ مگابایت. برای استفاده در صفحات، نشانی فایل را کپی کنید.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {items.map((it) => (
          <div key={it.path} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="aspect-square bg-slate-100">
              {it.mime?.startsWith("video/") ? (
                <video src={it.url} muted playsInline preload="metadata" className="h-full w-full object-cover" />
              ) : (
                <img src={it.url} alt={it.name} loading="lazy" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="space-y-1 p-1.5">
              <p className="truncate text-[10px] font-bold text-slate-800" title={it.name}>
                {it.name}
              </p>
              <p className="text-[10px] text-slate-500">{human(it.size)}</p>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => void copy(it)}
                  title="کپی نشانی فایل"
                  className={`inline-flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-lg border px-1.5 py-1 text-[10px] font-bold transition ${
                    copiedPath === it.path
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                      : "border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {copiedPath === it.path ? (
                    <>
                      <Check className="h-3 w-3" /> کپی شد
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" /> کپی
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => void remove(it.path)}
                  title="حذف فایل"
                  className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-red-200 bg-red-50 px-1.5 py-1 text-[10px] font-bold text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
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

export default MediaPane;
