import headerLogo from "@/assets/logoheder.png";
import { adminDb, adminReadSetting, adminWriteSetting } from "@/lib/admin-db";
import { AdminToaster } from "@/lib/notify";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutDashboard,
  MessageSquare,
  AlertTriangle,
  Menu as MenuIcon,
  PanelBottom,
  Plus,
  Trash2,
  Save,
  RefreshCw,
  Monitor,
  Smartphone,
  Tablet,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Wand2,
  ChevronLeft,
  Share2,
  Bot,
  MessagesSquare,
  FolderOpen,
  Github,
  Cloud,
  Search as SearchIcon,
  Image as ImageIcon,
  Send,
  Lock,
  LogOut,
  Eye,
  EyeOff,
  Bug,
  Database,
  MessageSquarePlus,

} from "lucide-react";
import { SocialPane } from "@/components/dashboard/SocialPane";
import { AiPane } from "@/components/dashboard/AiPane";
import { ChatRoomPane } from "@/components/dashboard/ChatRoomPane";
import { DocsPane } from "@/components/dashboard/DocsPane";
import { DeployPane } from "@/components/dashboard/DeployPane";
import { GithubPane } from "@/components/dashboard/GithubPane";
import { navItems, type NavItem } from "@/components/site-data";
import { TelegramPane } from "@/components/dashboard/TelegramPane";
import { BrandingPane } from "@/components/dashboard/BrandingPane";
import { InspectorPane } from "@/components/dashboard/InspectorPane";
import { dashboardStatus, lockDashboard, unlockDashboard } from "@/lib/admin.functions";
import { VE_SETTING_KEY, type OverrideMap } from "@/lib/visual-editor";
import { EDITOR_PAGES } from "@/lib/editor-pages";

import { VE_ANIMATIONS, DASHBOARD_LOGO } from "@/lib/site-config";
import { useBranding } from "@/hooks/use-branding";
import { SliderPane } from "@/components/dashboard/SliderPane";
import { SeoPane } from "@/components/dashboard/SeoPane";
import { WheelPane } from "@/components/dashboard/WheelPane";
import { MediaPane } from "@/components/dashboard/MediaPane";
import { BackendPane } from "@/components/dashboard/BackendPane";



export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "پیشخوان مدیریت | بیمه سامان — نمایندگی آذرخش" },
      { name: "description", content: "پیشخوان مدیریت محتوای وب‌سایت" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: DashboardGate,
});

/* ---------- Types ---------- */
type Contact = {
  id: string; full_name: string; phone: string; email: string | null;
  province: string | null; insurance_type: string | null; created_at: string;
};
type Damage = {
  id: string; full_name: string; phone: string; policy_number: string | null;
  accident_date: string | null; status: string; created_at: string;
};
type Suggestion = {
  id: string; tracking_id: number; category: string; received_at: string;
};
type MenuDevice = "desktop" | "mobile" | "tablet" | "both";
type MenuItem = {
  id: string; label: string; href: string | null; parent_id: string | null;
  position: number; device: MenuDevice; is_active: boolean;
};
type FooterSection = { id: string; title: string; position: number; is_active: boolean };
type FooterLink = { id: string; section_id: string; label: string; href: string; position: number };

type TabKey =
  | "overview"
  | "editor"
  | "inspector"
  | "contacts"
  | "suggestions"
  | "damages"
  | "menu"
  | "footer"
  | "social"
  | "ai"
  | "chat"
  | "docs"
  | "branding"
  | "medialib"
  | "backend"
  | "telegram"
  | "seo"
  | "deploy"
  | "github";

/* ---------- Root ---------- */
function Dashboard() {
  const branding = useBranding();
  const [tab, setTab] = useState<TabKey>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const nav: { key: TabKey; label: string; icon: any }[] = [
    { key: "overview", label: "پیشخوان", icon: LayoutDashboard },
    { key: "editor", label: "ویرایشگر بصری سایت", icon: Wand2 },
    { key: "inspector", label: "موس ایرادیاب و کدیاب", icon: Bug },
    { key: "contacts", label: "درخواست‌های مشاوره", icon: MessageSquare },
    { key: "suggestions", label: "انتقادات و پیشنهادات", icon: MessageSquarePlus },
    { key: "damages", label: "گزارش‌های خسارت", icon: AlertTriangle },
    { key: "menu", label: "ویرایش برگها (دسکتاپ/موبایل/تبلت)", icon: MenuIcon },
    { key: "footer", label: "فوتر و ستون‌ها", icon: PanelBottom },
    { key: "social", label: "شبکه‌های اجتماعی", icon: Share2 },
    { key: "ai", label: "چت هوش مصنوعی", icon: Bot },
    { key: "chat", label: "چت روم آنلاین", icon: MessagesSquare },
    { key: "docs", label: "مخزن مدارک مشتریان", icon: FolderOpen },
    { key: "branding", label: "لوگو، آیکن‌ها و عنوان", icon: ImageIcon },
    { key: "medialib", label: "کتابخانه رسانه (عکس/ویدئو)", icon: ImageIcon },
    { key: "backend", label: "اتصال Supabase (دیتابیس و فایل)", icon: Database },
    { key: "telegram", label: "ربات تلگرام و اتوماسیون", icon: Send },
    { key: "seo", label: "سئو و نتایج گوگل", icon: SearchIcon },
    { key: "deploy", label: "انتشار در Cloudflare", icon: Cloud },
    { key: "github", label: "اتصال گیت‌هاب", icon: Github },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-[#eef2f8] text-slate-900 font-sans">
      <AdminToaster />
      {/* Topbar */}
      <header className="sticky top-0 z-40 bg-[#0b1e3f] text-white shadow-md">
        <div className="flex items-center justify-between px-4 md:px-6 h-16">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10"
              aria-label="menu"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <img
                src={branding.dashboardLogoUrl || DASHBOARD_LOGO}
                alt="پیشخوان مدیریت"
                style={{ height: branding.logoHeightDashboard }}
                className="w-auto object-contain rounded-lg bg-white/95 p-1"
              />
              <div className="leading-tight">
                <div className="font-extrabold text-sm">پیشخوان مدیریت</div>
                <div className="text-[11px] opacity-70">بیمه سامان — نمایندگی آذرخش</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={async () => { await lockDashboard(); window.location.href = "/"; }}
              className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> خروج
            </button>
            <a href="/" className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition">مشاهده سایت</a>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar (RTL: sits on right) */}
        <aside
          className={`
            fixed lg:sticky top-16 right-0 h-[calc(100vh-4rem)] w-64 bg-[#0b1e3f] text-white
            transition-transform lg:translate-x-0 z-30
            ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
          `}
        >
          <nav className="p-3 flex flex-col gap-1">
            {nav.map((n) => {
              const active = tab === n.key;
              const Icon = n.icon;
              return (
                <button
                  key={n.key}
                  onClick={() => { setTab(n.key); setSidebarOpen(false); }}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-right transition
                    ${active
                      ? "bg-white text-[#0b1e3f] shadow-lg font-bold"
                      : "text-white/80 hover:bg-white/10 hover:text-white"}
                  `}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1">{n.label}</span>
                  {active && <ChevronLeft className="w-4 h-4" />}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)] p-4 md:p-8 lg:mr-0">
          {tab === "overview" && <OverviewPane />}
          {tab === "editor" && <VisualEditorPane />}
          {tab === "inspector" && <InspectorPane />}
          {tab === "contacts" && <ContactsPane />}
          {tab === "suggestions" && <SuggestionsPane />}
          {tab === "damages" && <DamagesPane />}
          {tab === "menu" && <MenuPane />}
          {tab === "footer" && <FooterPane />}
          {tab === "social" && <SocialPane />}
          {tab === "ai" && <AiPane />}
          {tab === "chat" && <ChatRoomPane />}
          {tab === "docs" && <DocsPane />}
          {tab === "branding" && <BrandingPane />}
          {tab === "medialib" && <MediaPane />}
          {tab === "backend" && <BackendPane />}
          {tab === "telegram" && <TelegramPane />}
          {tab === "seo" && <SeoPane />}
          {tab === "deploy" && <DeployPane />}
          {tab === "github" && <GithubPane />}
        </main>
      </div>
    </div>
  );
}

/* ---------- Password gate ---------- */
function DashboardGate() {
  const [state, setState] = useState<"loading" | "locked" | "open">("loading");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void dashboardStatus().then((r) => setState(r.unlocked ? "open" : "locked"));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await unlockDashboard({ data: { password } });
      if (res.ok) setState("open");
      else if (res.reason === "not-configured")
        setError("رمز پیشخوان روی سرور تنظیم نشده است (DASHBOARD_PASSWORD).");
      else if (res.reason === "no-session-secret")
        setError("متغیر SESSION_SECRET روی سرور تنظیم نشده است.");
      else if (res.reason === "server-error")
        setError(res.message ?? "خطای سرور در بررسی رمز.");
      else setError("رمز ورود نادرست است.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "ارتباط با سرور برقرار نشد.");
    } finally {
      setBusy(false);
    }
  }

  if (state === "open") return <Dashboard />;

  return (
    <div dir="rtl" className="min-h-screen grid place-items-center bg-[#0b1e3f] px-4 font-sans">
      <form onSubmit={submit} className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-[#0b1e3f] grid place-items-center text-white mx-auto mb-5">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-lg font-extrabold text-[#0b1e3f] text-center">ورود به پیشخوان</h1>
        <p className="text-xs text-slate-500 text-center mt-1 mb-6">رمز ورود را وارد کنید.</p>
        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="رمز ورود"
            autoFocus
            className="w-full text-sm rounded-xl border border-slate-300 px-4 py-3 ps-12 text-center"
            dir="ltr"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "پنهان کردن رمز" : "نمایش رمز"}
            title={showPassword ? "پنهان کردن رمز" : "نمایش رمز"}
            className="absolute inset-y-0 left-2 my-auto h-8 w-8 grid place-items-center rounded-lg text-slate-500 hover:text-[#0b1e3f] hover:bg-slate-100"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {error && <div className="text-xs text-rose-600 text-center mb-3">{error}</div>}
        <button
          type="submit"
          disabled={busy || state === "loading"}
          className="w-full bg-[#0b1e3f] hover:bg-[#122b57] text-white text-sm font-bold py-3 rounded-xl disabled:opacity-50"
        >
          {busy ? "در حال بررسی..." : "ورود"}
        </button>
      </form>
    </div>
  );
}

/* ---------- Visual editor ---------- */


const FONT_OPTIONS = [
  { v: "", label: "پیش‌فرض قالب" },
  { v: "Vazirmatn, sans-serif", label: "وزیرمتن" },
  { v: "IRANSans, Vazirmatn, sans-serif", label: "ایران‌سنس" },
  { v: "Tahoma, sans-serif", label: "Tahoma" },
  { v: "Georgia, serif", label: "Georgia" },
  { v: "monospace", label: "Monospace" },
];

/** Ready-made blocks that can be inserted after any selected element. */
const BLOCK_TEMPLATES: { key: string; label: string; html: string }[] = [
  {
    key: "text",
    label: "سکشن متنی ساده",
    html: `<section style="padding:32px 16px;text-align:center"><h2 style="font-weight:800;font-size:22px;color:#0b1e3f">عنوان سکشن جدید</h2><p style="margin-top:8px;color:#475569;font-size:14px">متن توضیحی این بخش را از همین‌جا ویرایش کنید.</p></section>`,
  },
  {
    key: "cta",
    label: "بنر فراخوان با دکمه",
    html: `<section style="margin:24px 16px;padding:28px;border-radius:24px;background:linear-gradient(120deg,#0b1e3f,#c81e35);color:#fff;text-align:center"><h2 style="font-weight:800;font-size:20px">همین حالا مشاوره رایگان بگیرید</h2><p style="margin-top:8px;font-size:13px;opacity:.9">کارشناسان نمایندگی آذرخش پاسخگوی شما هستند.</p><a href="/contact" style="display:inline-block;margin-top:14px;background:#fff;color:#0b1e3f;font-weight:800;font-size:13px;padding:10px 22px;border-radius:999px">تماس با ما</a></section>`,
  },
  {
    key: "cards",
    label: "سه کارت کنار هم",
    html: `<section style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding:24px 16px">${[1, 2, 3]
      .map(
        (i) =>
          `<div style="background:#fff;border:1px solid #e2e8f0;border-radius:18px;padding:18px;text-align:center"><h3 style="font-weight:800;color:#0b1e3f;font-size:15px">عنوان ${i}</h3><p style="margin-top:6px;color:#64748b;font-size:12px">توضیح کوتاه</p></div>`,
      )
      .join("")}</section>`,
  },
  {
    key: "divider",
    label: "جداکننده",
    html: `<div style="height:1px;background:#e2e8f0;margin:24px 16px"></div>`,
  },
  {
    key: "image",
    label: "تصویر تمام‌عرض",
    html: `<section style="padding:16px"><img src="${headerLogo}" alt="بیمه سامان" style="width:100%;border-radius:20px;object-fit:cover" /></section>`,
  },
];


type Selection = {
  selector: string;
  tag: string;
  text: string;
  html: string;
  href: string;
  computed: Record<string, string>;
};

function VisualEditorPane() {
  const [page, setPage] = useState("/");
  const [tab, setTab] = useState<"elements" | "media" | "menus" | "wheel">("elements");


  const [device, setDevice] = useState<"desktop" | "mobile" | "tablet">("desktop");
  const [mode, setMode] = useState<"select" | "interact">("select");
  const [currentPath, setCurrentPath] = useState("/");
  const [customPath, setCustomPath] = useState("");
  const [wide, setWide] = useState(false);
  const [sel, setSel] = useState<Selection | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [published, setPublished] = useState(false);
  const frame = useRef<HTMLIFrameElement | null>(null);
  const panel = useRef<HTMLElement | null>(null);


  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const d = e.data as { type?: string; payload?: Selection };
      const m = e.data as { type?: string; map?: OverrideMap };
      if (m?.type === "ve:map" && m.map) {
        void (async () => {
          const res = await adminWriteSetting(VE_SETTING_KEY, { map: m.map });
          if (!res.ok) return;
          setPublished(true);
          window.setTimeout(() => setPublished(false), 2000);
        })();
      }

      if (d?.type === "ve:selected" && d.payload) {
        setSel(d.payload);
        setDraft({
          text: d.payload.text,
          html: d.payload.html,
          href: d.payload.href,
          ...d.payload.computed,
          "bg-mode": "keep",
          "bg-alpha": "100",
          "anim-name": "",
          "anim-duration": "700",
          "anim-delay": "0",
          "anim-iteration": "1",
        });

        setSaved(false);
      }
      const n = e.data as { type?: string; path?: string };
      if ((n?.type === "ve:ready" || n?.type === "ve:navigate") && n.path) {
        setCurrentPath(n.path.replace(/[?&]ve=1/, "").replace(/\?$/, "") || "/");
      }
      if (n?.type === "ve:ready") {
        frame.current?.contentWindow?.postMessage({ type: "ve:mode", mode: modeRef.current }, "*");
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const modeRef = useRef<"select" | "interact">("select");
  useEffect(() => {
    modeRef.current = mode;
    frame.current?.contentWindow?.postMessage({ type: "ve:mode", mode }, "*");
  }, [mode]);

  const send = (msg: Record<string, unknown>) =>
    frame.current?.contentWindow?.postMessage(msg, "*");

  const previewSrc = (path: string, bust?: number) => {
    const separator = path.includes("?") ? "&" : "?";
    return `${path}${separator}ve=1&veDevice=${device}${bust ? `&t=${bust}` : ""}`;
  };

  /* On phones the settings panel sits under the preview — bring it into view. */
  useEffect(() => {
    if (!sel) return;
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      panel.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [sel]);

  const field = (k: string, v: string) => setDraft((p) => ({ ...p, [k]: v }));

  const apply = () => {
    if (!sel) return;
    const styleKeys = ["color", "font-size", "font-weight", "font-family", "text-align"];
    const style: Record<string, string> = {};
    for (const k of styleKeys) if (draft[k]) style[k] = draft[k];

    // Background: keep / fully transparent / custom color with opacity
    const mode = draft["bg-mode"] ?? "keep";
    if (mode === "transparent") style["background-color"] = "transparent";
    else if (mode === "custom") {
      const hex = draft["background-color"] || "#ffffff";
      const a = Math.min(100, Math.max(0, Number(draft["bg-alpha"] ?? "100"))) / 100;
      const r = parseInt(hex.slice(1, 3), 16) || 0;
      const g = parseInt(hex.slice(3, 5), 16) || 0;
      const b = parseInt(hex.slice(5, 7), 16) || 0;
      style["background-color"] = `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    // Animation preset
    if (draft["anim-name"]) {
      style["animation"] =
        `${draft["anim-name"]} ${draft["anim-duration"] || "700"}ms ease-out ${draft["anim-delay"] || "0"}ms ${draft["anim-iteration"] || "1"} both`;
    }

    // Hover / touch colors (desktop hover + mobile tap)
    const hover: Record<string, string> = {};
    if (draft["hover-on"] === "1") {
      if (draft["hover-color"]) hover["color"] = draft["hover-color"];
      if (draft["hover-bg-mode"] === "transparent") hover["background-color"] = "transparent";
      else if (draft["hover-bg-mode"] === "custom") {
        const hx = draft["hover-bg"] || "#ffffff";
        const ha = Math.min(100, Math.max(0, Number(draft["hover-bg-alpha"] ?? "100"))) / 100;
        hover["background-color"] =
          `rgba(${parseInt(hx.slice(1, 3), 16) || 0}, ${parseInt(hx.slice(3, 5), 16) || 0}, ${parseInt(hx.slice(5, 7), 16) || 0}, ${ha})`;
      }
      if (draft["hover-border"]) hover["border-color"] = draft["hover-border"];
      if (draft["hover-underline"] === "1") hover["text-decoration"] = "underline";
    } else if (draft["hover-on"] === "0") {
      hover["color"] = "";
      hover["background-color"] = "";
      hover["border-color"] = "";
      hover["text-decoration"] = "";
    }

    const patch: Record<string, unknown> = { style, hover, hoverDeep: draft["hover-deep"] === "1" };
    if (sel.text && draft.text !== sel.text) patch.text = draft.text;
    if (draft.html && draft.html !== sel.html) patch.html = draft.html;
    if (draft.href !== sel.href) patch.href = draft.href;
    if (draft.target) patch.target = draft.target;
    if (draft.rel) patch.rel = draft.rel;
    send({ type: "ve:update", selector: sel.selector, patch });
    setSaved(true);

  };


  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-extrabold text-[#0b1e3f]">ویرایشگر بصری سایت</h1>
        <p className="text-xs text-slate-500 mt-1 leading-6">
          روی هر عنصر داخل سایت کلیک کنید و فونت، رنگ، شفافیت، انیمیشن، متن، آیکن/SVG و لینک آن را تغییر دهید.
        </p>
      </div>

      <div className="flex flex-wrap rounded-xl overflow-hidden border border-slate-300 bg-white w-fit mb-4">
        <button onClick={() => setTab("elements")}
          className={`px-4 py-2 text-xs font-bold ${tab === "elements" ? "bg-[#0b1e3f] text-white" : ""}`}>
          ویرایش عناصر صفحه
        </button>
        <button onClick={() => setTab("media")}
          className={`px-4 py-2 text-xs font-bold ${tab === "media" ? "bg-[#0b1e3f] text-white" : ""}`}>
          اسلایدر و انیمیشن‌ها
        </button>
        <button onClick={() => setTab("wheel")}
          className={`px-4 py-2 text-xs font-bold ${tab === "wheel" ? "bg-[#0b1e3f] text-white" : ""}`}>
          چرخ‌وفلک و دکمه خرید
        </button>
        <button onClick={() => setTab("menus")}
          className={`px-4 py-2 text-xs font-bold ${tab === "menus" ? "bg-[#0b1e3f] text-white" : ""}`}>
          منوها (افزودن/حذف)
        </button>
      </div>

      {tab === "media" ? <SliderPane /> : tab === "wheel" ? <WheelPane /> : tab === "menus" ? <MenuPane /> : (

      <>
      <div className="flex flex-wrap items-center gap-2 mb-4">

        <select
          value={page}
          onChange={(e) => { setPage(e.target.value); setSel(null); }}
          className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm"
        >
          {EDITOR_PAGES.map((p) => (
            <option key={p.path} value={p.path}>{p.label}</option>
          ))}
        </select>
        <div className="flex rounded-xl overflow-hidden border border-slate-300 bg-white">
          <button onClick={() => { setDevice("desktop"); setSel(null); }}
            className={`px-3 py-2 text-xs flex items-center gap-1.5 ${device === "desktop" ? "bg-[#0b1e3f] text-white" : ""}`}>
            <Monitor className="w-3.5 h-3.5" /> دسکتاپ
          </button>
          <button onClick={() => { setDevice("tablet"); setSel(null); }}
            className={`px-3 py-2 text-xs flex items-center gap-1.5 ${device === "tablet" ? "bg-[#0b1e3f] text-white" : ""}`}>
            <Tablet className="w-3.5 h-3.5" /> تبلت
          </button>
          <button onClick={() => { setDevice("mobile"); setSel(null); }}
            className={`px-3 py-2 text-xs flex items-center gap-1.5 ${device === "mobile" ? "bg-[#0b1e3f] text-white" : ""}`}>
            <Smartphone className="w-3.5 h-3.5" /> موبایل
          </button>
        </div>
        <div className="flex rounded-xl overflow-hidden border border-slate-300 bg-white">
          <button onClick={() => setMode("select")}
            className={`px-3 py-2 text-xs font-bold ${mode === "select" ? "bg-[#0b1e3f] text-white" : ""}`}>
            حالت انتخاب
          </button>
          <button onClick={() => setMode("interact")}
            className={`px-3 py-2 text-xs font-bold ${mode === "interact" ? "bg-[#0b1e3f] text-white" : ""}`}>
            حالت تعامل
          </button>
        </div>
        <button
          onClick={() => { if (frame.current) frame.current.src = previewSrc(page, Date.now()); }}
          className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> بازخوانی
        </button>
        <button
          onClick={() => setWide((w) => !w)}
          className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
        >
          {wide ? "نمای معمولی" : "نمای بزرگ"}
        </button>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const p = customPath.trim();
            if (!p) return;
            const path = p.startsWith("/") ? p : `/${p}`;
            setPage(path);
            setSel(null);
            if (frame.current) frame.current.src = previewSrc(path, Date.now());
          }}
          className="flex items-center gap-1"
        >
          <input
            value={customPath}
            onChange={(e) => setCustomPath(e.target.value)}
            dir="ltr"
            placeholder="/insurance/car/body"
            className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs w-56"
          />
          <button type="submit" className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs">
            باز کن
          </button>
        </form>
        {published && (
          <span className="text-[11px] text-emerald-600 font-bold px-2">روی سایت منتشر شد ✓</span>
        )}
        <button
          onClick={() => { if (confirm("همه تغییرات ظاهری حذف شود؟")) send({ type: "ve:resetAll" }); }}
          className="px-3 py-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 text-xs flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" /> بازنشانی کل تغییرات
        </button>
        <span className="text-[11px] text-slate-500 font-mono px-2" dir="ltr">{currentPath}</span>
      </div>

      <p className="text-[11px] text-slate-500 mb-3 leading-6">
        در «حالت تعامل» سایت دقیقاً مثل حالت واقعی کار می‌کند (دکمه خرید آنلاین، چرخ‌وفلک، اسلایدر و منوها)؛
        برای انتخاب یک عنصر در این حالت، در کامپیوتر کلید Alt را نگه دارید و کلیک کنید و در موبایل انگشت خود را روی عنصر نگه دارید (لمس طولانی).
      </p>

      <div className={wide || device === "desktop" ? "grid gap-4" : "grid lg:grid-cols-[1fr_320px] gap-4"}>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div
            className={
              device === "mobile"
                ? "mx-auto w-full max-w-[390px]"
                : device === "tablet"
                  ? "mx-auto w-full max-w-[834px]"
                  : "w-full"
            }
          >
            <iframe
              ref={frame}
              src={previewSrc(page)}
              title="preview"
              className={`w-full border-0 bg-white ${wide || device === "desktop" ? "h-[85vh]" : "h-[70vh]"}`}
            />

          </div>
        </div>

        <aside ref={panel} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 h-fit lg:sticky lg:top-24">
          {!sel ? (
            <p className="text-xs text-slate-500 leading-6">
              برای شروع، داخل پیش‌نمایش روی عنصر مورد نظر کلیک کنید.
            </p>
          ) : (
            <div className="space-y-3">
              <div className="text-[11px] text-slate-500 break-all bg-slate-50 rounded-lg p-2 font-mono" dir="ltr">
                &lt;{sel.tag}&gt;
              </div>

              {sel.text !== "" && (
                <Field label="متن">
                  <textarea rows={3} value={draft.text ?? ""} onChange={(e) => field("text", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm" />
                </Field>
              )}

              {sel.tag === "select" && (
                <SelectOptionsEditor
                  html={draft.html ?? ""}
                  onChange={(h) => field("html", h)}
                />
              )}

              <Field label="آیکن / SVG / محتوای HTML">
                <textarea rows={3} value={draft.html ?? ""} onChange={(e) => field("html", e.target.value)}
                  dir="ltr" className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono" />
              </Field>


              <WordLinkEditor
                html={draft.html ?? ""}
                text={draft.text ?? ""}
                onChange={(h) => field("html", h)}
              />

              <Field label="لینک (href)">
                <input value={draft.href ?? ""} onChange={(e) => field("href", e.target.value)} dir="ltr"
                  placeholder="/contact یا https://..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm" />
              </Field>

              <div className="grid grid-cols-2 gap-2">
                <Field label="باز شدن">
                  <select value={draft.target ?? ""} onChange={(e) => field("target", e.target.value)}
                    className="w-full px-2 py-2 rounded-xl border border-slate-300 text-xs">
                    <option value="">همین تب</option>
                    <option value="_blank">تب جدید</option>
                  </select>
                </Field>
                <Field label="rel (بک‌لینک)">
                  <select value={draft.rel ?? ""} onChange={(e) => field("rel", e.target.value)}
                    className="w-full px-2 py-2 rounded-xl border border-slate-300 text-xs">
                    <option value="">پیش‌فرض</option>
                    <option value="dofollow">dofollow</option>
                    <option value="nofollow">nofollow</option>
                    <option value="noopener noreferrer">noopener noreferrer</option>
                  </select>
                </Field>
              </div>

              <Field label="فونت">
                <select value={draft["font-family"] ?? ""} onChange={(e) => field("font-family", e.target.value)}
                  className="w-full px-2 py-2 rounded-xl border border-slate-300 text-xs">
                  {FONT_OPTIONS.map((f) => <option key={f.label} value={f.v}>{f.label}</option>)}
                </select>
              </Field>

              <div className="grid grid-cols-2 gap-2">
                <Field label="اندازه فونت">
                  <input value={draft["font-size"] ?? ""} onChange={(e) => field("font-size", e.target.value)} dir="ltr"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm" />
                </Field>
                <Field label="ضخامت">
                  <select value={draft["font-weight"] ?? ""} onChange={(e) => field("font-weight", e.target.value)}
                    className="w-full px-2 py-2 rounded-xl border border-slate-300 text-xs">
                    {["", "300", "400", "500", "600", "700", "800", "900"].map((w) => (
                      <option key={w} value={w}>{w || "پیش‌فرض"}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="رنگ متن">
                <input type="color" value={draft.color || "#000000"} onChange={(e) => field("color", e.target.value)}
                  className="w-full h-10 rounded-xl border border-slate-300" />
              </Field>

              {/* Hover / touch colors — works for menu items and their sub-items */}
              <div className="rounded-xl border border-slate-200 p-2.5 space-y-2">
                <Field label="هاور و لمس (دسکتاپ و موبایل)">
                  <select value={draft["hover-on"] ?? ""} onChange={(e) => field("hover-on", e.target.value)}
                    className="w-full px-2 py-2 rounded-xl border border-slate-300 text-xs">
                    <option value="">بدون تغییر</option>
                    <option value="1">فعال کردن رنگ هاور</option>
                    <option value="0">حذف رنگ هاور</option>
                  </select>
                </Field>
                {draft["hover-on"] === "1" && (
                  <>
                    <Field label="رنگ متن در هاور">
                      <input type="color" value={draft["hover-color"] || "#0b1e3f"}
                        onChange={(e) => field("hover-color", e.target.value)}
                        className="w-full h-10 rounded-xl border border-slate-300" />
                    </Field>
                    <Field label="پس‌زمینه در هاور">
                      <select value={draft["hover-bg-mode"] ?? "keep"} onChange={(e) => field("hover-bg-mode", e.target.value)}
                        className="w-full px-2 py-2 rounded-xl border border-slate-300 text-xs">
                        <option value="keep">بدون تغییر</option>
                        <option value="transparent">کاملاً شفاف</option>
                        <option value="custom">رنگی با کنترل شفافیت</option>
                      </select>
                    </Field>
                    {draft["hover-bg-mode"] === "custom" && (
                      <>
                        <Field label="رنگ پس‌زمینه هاور">
                          <input type="color" value={draft["hover-bg"] || "#ffffff"}
                            onChange={(e) => field("hover-bg", e.target.value)}
                            className="w-full h-10 rounded-xl border border-slate-300" />
                        </Field>
                        <Field label={`شفافیت پس‌زمینه هاور: ${draft["hover-bg-alpha"] ?? "100"}%`}>
                          <input type="range" min={0} max={100} step={1}
                            value={Number(draft["hover-bg-alpha"] ?? "100")}
                            onChange={(e) => field("hover-bg-alpha", e.target.value)}
                            className="w-full" />
                        </Field>
                      </>
                    )}
                    <Field label="رنگ حاشیه در هاور">
                      <input type="color" value={draft["hover-border"] || "#0b1e3f"}
                        onChange={(e) => field("hover-border", e.target.value)}
                        className="w-full h-10 rounded-xl border border-slate-300" />
                    </Field>
                    <label className="flex items-center gap-2 text-xs text-slate-600">
                      <input type="checkbox" checked={draft["hover-underline"] === "1"}
                        onChange={(e) => field("hover-underline", e.target.checked ? "1" : "")} />
                      زیرخط‌دار شدن در هاور
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-600">
                      <input type="checkbox" checked={draft["hover-deep"] === "1"}
                        onChange={(e) => field("hover-deep", e.target.checked ? "1" : "")} />
                      اعمال روی آیکن‌ها و زیر آیتم‌های داخل این عنصر
                    </label>
                    <p className="text-[11px] text-slate-500 leading-5">
                      روی آیتم فهرست یا زیرآیتم کلیک کنید و رنگ دلخواه هاور را انتخاب کنید؛ در موبایل هنگام لمس همان رنگ نمایش داده می‌شود.
                    </p>
                  </>
                )}
              </div>



              <div className="rounded-xl border border-slate-200 p-2.5 space-y-2">
                <Field label="پس‌زمینه">
                  <select value={draft["bg-mode"] ?? "keep"} onChange={(e) => field("bg-mode", e.target.value)}
                    className="w-full px-2 py-2 rounded-xl border border-slate-300 text-xs">
                    <option value="keep">بدون تغییر</option>
                    <option value="transparent">کاملاً شفاف</option>
                    <option value="custom">رنگی با کنترل شفافیت</option>
                  </select>
                </Field>
                {(draft["bg-mode"] ?? "keep") === "custom" && (
                  <>
                    <Field label="رنگ پس‌زمینه">
                      <input type="color" value={draft["background-color"] || "#ffffff"}
                        onChange={(e) => field("background-color", e.target.value)}
                        className="w-full h-10 rounded-xl border border-slate-300" />
                    </Field>
                    <Field label={`میزان شفافیت: ${draft["bg-alpha"] ?? "100"}%`}>
                      <input type="range" min={0} max={100} step={1}
                        value={Number(draft["bg-alpha"] ?? "100")}
                        onChange={(e) => field("bg-alpha", e.target.value)}
                        className="w-full" />
                    </Field>
                  </>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 p-2.5 space-y-2">
                <Field label="انیمیشن عنصر">
                  <select value={draft["anim-name"] ?? ""} onChange={(e) => field("anim-name", e.target.value)}
                    className="w-full px-2 py-2 rounded-xl border border-slate-300 text-xs">
                    {VE_ANIMATIONS.map((a) => <option key={a.v} value={a.v}>{a.label}</option>)}
                  </select>
                </Field>
                {draft["anim-name"] && (
                  <div className="grid grid-cols-3 gap-2">
                    <Field label="مدت (ms)">
                      <input dir="ltr" value={draft["anim-duration"] ?? "700"} onChange={(e) => field("anim-duration", e.target.value)}
                        className="w-full px-2 py-2 rounded-xl border border-slate-300 text-xs" />
                    </Field>
                    <Field label="تأخیر (ms)">
                      <input dir="ltr" value={draft["anim-delay"] ?? "0"} onChange={(e) => field("anim-delay", e.target.value)}
                        className="w-full px-2 py-2 rounded-xl border border-slate-300 text-xs" />
                    </Field>
                    <Field label="تکرار">
                      <select value={draft["anim-iteration"] ?? "1"} onChange={(e) => field("anim-iteration", e.target.value)}
                        className="w-full px-1 py-2 rounded-xl border border-slate-300 text-xs">
                        <option value="1">۱ بار</option>
                        <option value="2">۲ بار</option>
                        <option value="3">۳ بار</option>
                        <option value="infinite">بی‌نهایت</option>
                      </select>
                    </Field>
                  </div>
                )}
              </div>

              <Field label="چینش متن">
                <select value={draft["text-align"] ?? ""} onChange={(e) => field("text-align", e.target.value)}
                  className="w-full px-2 py-2 rounded-xl border border-slate-300 text-xs">
                  {["", "right", "center", "left", "justify"].map((a) => (
                    <option key={a} value={a}>{a || "پیش‌فرض"}</option>
                  ))}
                </select>
              </Field>


              {/* Insert a new block / section right after this element */}
              <div className="rounded-xl border border-slate-200 p-2.5 space-y-2">
                <Field label="افزودن بلوک یا سکشن جدید (بعد از این عنصر)">
                  <select
                    value=""
                    onChange={(e) => {
                      const t = BLOCK_TEMPLATES.find((b) => b.key === e.target.value);
                      if (t) field("block", t.html);
                    }}
                    className="w-full px-2 py-2 rounded-xl border border-slate-300 text-xs"
                  >
                    <option value="">یک قالب آماده انتخاب کنید…</option>
                    {BLOCK_TEMPLATES.map((b) => (
                      <option key={b.key} value={b.key}>{b.label}</option>
                    ))}
                  </select>
                </Field>
                <textarea
                  rows={4}
                  dir="ltr"
                  value={draft.block ?? ""}
                  onChange={(e) => field("block", e.target.value)}
                  placeholder="<section>…</section>"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => send({ type: "ve:update", selector: sel.selector, patch: { block: draft.block ?? "" } })}
                    className="flex-1 text-xs font-bold bg-emerald-600 text-white rounded-xl py-2"
                  >
                    افزودن / به‌روزرسانی بلوک
                  </button>
                  <button
                    onClick={() => { field("block", ""); send({ type: "ve:update", selector: sel.selector, patch: { block: "" } }); }}
                    className="px-3 text-xs rounded-xl border border-slate-300"
                  >
                    حذف بلوک
                  </button>
                </div>
              </div>


              <div className="flex gap-2 pt-1">
                <button onClick={apply}
                  className="flex-1 bg-[#0b1e3f] hover:bg-[#122b57] text-white text-sm font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5">
                  <Save className="w-4 h-4" /> اعمال
                </button>
                <button onClick={() => send({ type: "ve:reset", selector: sel.selector })}
                  className="px-3 rounded-xl border border-slate-300 text-xs">حذف تغییر</button>
              </div>
              <button
                onClick={() => send({ type: "ve:update", selector: sel.selector, patch: { hidden: true } })}
                className="w-full text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl py-2"
              >
                حذف / پنهان‌سازی این بخش
              </button>
              {saved && <div className="text-[11px] text-emerald-600">ذخیره شد.</div>}
            </div>
          )}
        </aside>
      </div>
      </>
      )}
    </div>

  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-bold text-slate-600 mb-1">{label}</span>
      {children}
    </label>
  );
}

/* ---------- dropdown (<select>) option editor ---------- */
type VeOption = { label: string; value: string };

function parseOptions(html: string): VeOption[] {
  if (typeof window === "undefined" || !html) return [];
  const doc = new DOMParser().parseFromString(`<select>${html}</select>`, "text/html");
  return Array.from(doc.querySelectorAll("option")).map((o) => ({
    label: o.textContent ?? "",
    value: o.getAttribute("value") ?? "",
  }));
}

function serializeOptions(opts: VeOption[]): string {
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  return opts.map((o) => `<option value="${esc(o.value)}">${esc(o.label)}</option>`).join("");
}

/**
 * Native dropdowns can't be clicked open inside the editor iframe, so their
 * items are edited here as a simple list (label + value, add / delete / move).
 */
function SelectOptionsEditor({
  html,
  onChange,
}: {
  html: string;
  onChange: (html: string) => void;
}) {
  const opts = parseOptions(html);
  const update = (next: VeOption[]) => onChange(serializeOptions(next));
  const edit = (i: number, patch: Partial<VeOption>) =>
    update(opts.map((o, idx) => (idx === i ? { ...o, ...patch } : o)));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= opts.length) return;
    const next = [...opts];
    const a = next[i]!;
    const b = next[j]!;
    next[i] = b;
    next[j] = a;
    update(next);
  };

  return (
    <div className="rounded-xl border border-slate-200 p-2 space-y-2 bg-slate-50">
      <div className="text-[11px] font-bold text-slate-600">گزینه‌های منوی کشویی</div>
      {opts.length === 0 && (
        <p className="text-[11px] text-slate-500">گزینه‌ای وجود ندارد. یک گزینه اضافه کنید.</p>
      )}
      <div className="space-y-2 max-h-64 overflow-auto pr-1">
        {opts.map((o, i) => (
          <div key={i} className="flex items-center gap-1">
            <input
              value={o.label}
              onChange={(e) => edit(i, { label: e.target.value })}
              placeholder="متن گزینه"
              className="flex-1 px-2 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
            />
            <input
              value={o.value}
              onChange={(e) => edit(i, { value: e.target.value })}
              placeholder="مقدار"
              dir="ltr"
              className="w-24 px-2 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-mono"
            />
            <button
              type="button"
              onClick={() => move(i, -1)}
              title="بالا"
              className="px-2 py-1 rounded-lg border border-slate-300 bg-white text-xs"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => move(i, 1)}
              title="پایین"
              className="px-2 py-1 rounded-lg border border-slate-300 bg-white text-xs"
            >
              ↓
            </button>
            <button
              type="button"
              onClick={() => update(opts.filter((_, idx) => idx !== i))}
              title="حذف"
              className="px-2 py-1 rounded-lg border border-red-200 text-red-600 bg-white text-xs"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => update([...opts, { label: "گزینه جدید", value: "" }])}
        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold"
      >
        افزودن گزینه
      </button>
      <p className="text-[10px] text-slate-500 leading-5">
        پس از ویرایش، دکمه «ذخیره تغییرات» را بزنید تا روی سایت اعمال شود.
      </p>
    </div>
  );
}



/* ---------- Overview ---------- */
/**
 * Turns any word or phrase inside the selected element into a real backlink.
 * It rewrites the element HTML, so it works on headings, paragraphs and menu
 * items alike.
 */
function WordLinkEditor({ html, text, onChange }: {
  html: string;
  text: string;
  onChange: (html: string) => void;
}) {
  const [word, setWord] = useState("");
  const [href, setHref] = useState("");
  const [blank, setBlank] = useState(false);
  const [nofollow, setNofollow] = useState(false);
  const [err, setErr] = useState("");

  const source = html || text;

  const link = () => {
    const w = word.trim();
    const u = href.trim();
    if (!w || !u) { setErr("کلمه و آدرس لینک را وارد کنید."); return; }
    if (!source.includes(w)) { setErr("این عبارت داخل متن این عنصر پیدا نشد."); return; }
    const attrs = [`href="${u}"`];
    if (blank) attrs.push('target="_blank"');
    attrs.push(`rel="${nofollow ? "nofollow noopener" : "noopener"}"`);
    const anchor = `<a ${attrs.join(" ")} style="text-decoration:underline">${w}</a>`;
    onChange(source.replace(w, anchor));
    setErr("");
    setWord("");
    setHref("");
  };

  return (
    <div className="rounded-xl border border-slate-200 p-2.5 space-y-2">
      <Field label="لینک‌دار کردن یک کلمه از متن (بک‌لینک)">
        <input value={word} onChange={(e) => setWord(e.target.value)}
          placeholder="کلمه یا عبارت داخل متن"
          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm" />
      </Field>
      <input value={href} onChange={(e) => setHref(e.target.value)} dir="ltr"
        placeholder="/insurance/fire یا https://..."
        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs" />
      <div className="flex items-center gap-3 text-[11px] text-slate-600">
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={blank} onChange={(e) => setBlank(e.target.checked)} /> تب جدید
        </label>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={nofollow} onChange={(e) => setNofollow(e.target.checked)} /> nofollow
        </label>
        <button type="button" onClick={link}
          className="ms-auto px-3 py-1.5 rounded-lg bg-[#0b1e3f] text-white text-[11px] font-bold">
          افزودن لینک
        </button>
      </div>
      {err && <p className="text-[11px] text-rose-600">{err}</p>}
      <p className="text-[10px] text-slate-500 leading-5">
        بعد از افزودن، دکمه «ذخیره تغییرات» را بزنید تا روی سایت منتشر شود.
      </p>
    </div>
  );
}

function OverviewPane() {
  const [cCount, setCCount] = useState<number | null>(null);
  const [dCount, setDCount] = useState<number | null>(null);
  const [mCount, setMCount] = useState<number | null>(null);
  useEffect(() => {
    (async () => {
      const [c, d, m] = await Promise.all([
        adminDb("contact_messages").select("*", { count: "exact", head: true }),
        adminDb("damage_reports").select("*", { count: "exact", head: true }),
        adminDb("site_menu_items").select("*", { count: "exact", head: true }),
      ]);
      setCCount(c.count ?? 0); setDCount(d.count ?? 0); setMCount(m.count ?? 0);
    })();
  }, []);
  const cards = [
    { label: "درخواست‌های مشاوره", value: cCount, icon: MessageSquare, color: "from-blue-500 to-indigo-600" },
    { label: "گزارش‌های خسارت", value: dCount, icon: AlertTriangle, color: "from-amber-500 to-orange-600" },
    { label: "آیتم‌های منو", value: mCount, icon: MenuIcon, color: "from-emerald-500 to-teal-600" },
  ];
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#0b1e3f] mb-2">خوش آمدید 👋</h1>
      <p className="text-sm text-slate-500 mb-8">خلاصه‌ای از محتوای وب‌سایت شما.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 hover:shadow-xl transition">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.color} grid place-items-center text-white mb-4`}>
              <c.icon className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-[#0b1e3f]">{c.value ?? "—"}</div>
            <div className="text-xs text-slate-500 mt-1">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Contacts ---------- */
function ContactsPane() {
  const [rows, setRows] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    const { data } = await adminDb("contact_messages").select("*").order("created_at", { ascending: false }).limit(200);
    setRows((data as Contact[]) || []); setLoading(false);
  };
  useEffect(() => { load(); }, []);
  const del = async (id: string) => {
    if (!confirm("حذف شود؟")) return;
    await adminDb("contact_messages").delete().eq("id", id);
    load();
  };
  return (
    <PaneShell title="درخواست‌های مشاوره" onRefresh={load}>
      {loading ? <Empty text="در حال بارگذاری..." /> : rows.length === 0 ? <Empty text="موردی ثبت نشده." /> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <Th>نام</Th><Th>تلفن</Th><Th>ایمیل</Th><Th>استان</Th><Th>نوع بیمه</Th><Th>تاریخ</Th><Th></Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                  <Td>{r.full_name}</Td>
                  <Td dir="ltr">{r.phone}</Td>
                  <Td>{r.email || "—"}</Td>
                  <Td>{r.province || "—"}</Td>
                  <Td>{r.insurance_type || "—"}</Td>
                  <Td className="text-slate-500">{new Date(r.created_at).toLocaleDateString("fa-IR")}</Td>
                  <Td><IconBtn onClick={() => del(r.id)} tone="danger"><Trash2 className="w-4 h-4" /></IconBtn></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PaneShell>
  );
}

/* ---------- Suggestions & Criticism ---------- */
function SuggestionsPane() {
  const [rows, setRows] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    const { data } = await adminDb("suggestions")
      .select("id, tracking_id, category, received_at")
      .order("received_at", { ascending: false })
      .limit(200);
    setRows((data as Suggestion[]) || []); setLoading(false);
  };
  useEffect(() => { load(); }, []);
  return (
    <PaneShell title="انتقادات و پیشنهادات" onRefresh={load}>
      {loading ? <Empty text="در حال بارگذاری..." /> : rows.length === 0 ? <Empty text="موردی ثبت نشده." /> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <Th>کد رهگیری</Th><Th>نوع</Th><Th>تاریخ دریافت</Th><Th>ساعت دریافت</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const d = new Date(r.received_at);
                return (
                  <tr key={r.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                    <Td dir="ltr">{r.tracking_id}</Td>
                    <Td>{r.category === "criticism" ? "انتقاد" : "پیشنهاد"}</Td>
                    <Td className="text-slate-500">{d.toLocaleDateString("fa-IR")}</Td>
                    <Td className="text-slate-500">{d.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}</Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </PaneShell>
  );
}

/* ---------- Damages ---------- */
function DamagesPane() {
  const [rows, setRows] = useState<Damage[]>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    const { data } = await adminDb("damage_reports").select("*").order("created_at", { ascending: false }).limit(200);
    setRows((data as Damage[]) || []); setLoading(false);
  };
  useEffect(() => { load(); }, []);
  const setStatus = async (id: string, status: string) => {
    await adminDb("damage_reports").update({ status } as any).eq("id", id);
    load();
  };
  const del = async (id: string) => {
    if (!confirm("حذف شود؟")) return;
    await adminDb("damage_reports").delete().eq("id", id);
    load();
  };
  return (
    <PaneShell title="گزارش‌های خسارت" onRefresh={load}>
      {loading ? <Empty text="در حال بارگذاری..." /> : rows.length === 0 ? <Empty text="موردی ثبت نشده." /> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <Th>نام</Th><Th>تلفن</Th><Th>شماره بیمه‌نامه</Th><Th>تاریخ حادثه</Th><Th>وضعیت</Th><Th>ثبت</Th><Th></Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                  <Td>{r.full_name}</Td>
                  <Td dir="ltr">{r.phone}</Td>
                  <Td>{r.policy_number || "—"}</Td>
                  <Td>{r.accident_date || "—"}</Td>
                  <Td>
                    <select value={r.status} onChange={(e) => setStatus(r.id, e.target.value)}
                      className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1">
                      <option value="new">جدید</option>
                      <option value="in_progress">در حال رسیدگی</option>
                      <option value="done">رسیدگی شده</option>
                    </select>
                  </Td>
                  <Td className="text-slate-500">{new Date(r.created_at).toLocaleDateString("fa-IR")}</Td>
                  <Td><IconBtn onClick={() => del(r.id)} tone="danger"><Trash2 className="w-4 h-4" /></IconBtn></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PaneShell>
  );
}

/* ---------- Menu Editor ---------- */
function MenuPane() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [device, setDevice] = useState<"desktop" | "mobile" | "tablet">("desktop");
  const dragId = useRef<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await adminDb("site_menu_items").select("*").order("position", { ascending: true });
    // Defensive dedupe: the same row must never render twice.
    const seen = new Set<string>();
    const rows = ((data as MenuItem[]) || []).filter((r) => {
      if (seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    });
    setItems(rows);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const shown = useMemo(() =>
    items.filter((i) => i.device === "both" || i.device === device),
    [items, device]);

  const roots = shown.filter((i) => !i.parent_id);
  const childrenOf = (id: string) => shown.filter((i) => i.parent_id === id);

  const siblingsOf = (parent_id: string | null, excludeId?: string) =>
    items
      .filter((i) => i.parent_id === parent_id && i.id !== excludeId)
      .sort((a, b) => a.position - b.position);

  /** True when `id` sits inside the subtree of `ancestorId`. */
  const isDescendant = (id: string, ancestorId: string): boolean => {
    let cur = items.find((i) => i.id === id)?.parent_id ?? null;
    while (cur) {
      if (cur === ancestorId) return true;
      cur = items.find((i) => i.id === cur)?.parent_id ?? null;
    }
    return false;
  };

  /** Rewrites parent_id/position for one sibling list. UPDATE only — never INSERT. */
  const persistOrder = async (parent_id: string | null, orderedIds: string[]) => {
    for (let p = 0; p < orderedIds.length; p++) {
      await adminDb("site_menu_items").update({ parent_id, position: p } as any).eq("id", orderedIds[p]);
    }
  };

  const add = async (parent_id: string | null) => {
    if (saving) return;
    const label = prompt("عنوان آیتم منو:");
    if (!label) return;
    const href = prompt("لینک (اختیاری):") || null;
    setSaving(true);
    const siblings = items.filter((i) => i.parent_id === parent_id);
    await adminDb("site_menu_items").insert({
      label, href, parent_id, position: siblings.length,
      device: parent_id ? "both" : device, is_active: true,
    } as any);
    await load();
    setSaving(false);
  };

  /**
   * Edit/Save path. Always an UPDATE on the existing id — the id itself is
   * stripped from the patch so it can never be overwritten, and the `saving`
   * guard blocks double-clicks and re-entrant saves (the old duplicate bug).
   */
  const update = async (id: string, patch: Partial<MenuItem>) => {
    if (!id || saving) return;
    setSaving(true);
    const { id: _ignored, ...rest } = patch as Partial<MenuItem> & { id?: string };
    await adminDb("site_menu_items").update(rest as any).eq("id", id);
    await load();
    setSaving(false);
  };

  const del = async (id: string) => {
    if (saving) return;
    if (!confirm("این آیتم و همه زیرآیتم‌هایش حذف شود؟")) return;
    setSaving(true);
    await adminDb("site_menu_items").delete().eq("id", id);
    await load();
    setSaving(false);
  };

  /** Moves an item one step up/down among its siblings. UPDATE on position only. */
  const move = async (item: MenuItem, dir: -1 | 1) => {
    if (saving) return;
    const sibs = siblingsOf(item.parent_id);
    const idx = sibs.findIndex((s) => s.id === item.id);
    const swap = sibs[idx + dir];
    if (!swap) return;
    setSaving(true);
    await adminDb("site_menu_items").update({ position: swap.position } as any).eq("id", item.id);
    await adminDb("site_menu_items").update({ position: item.position } as any).eq("id", swap.id);
    await load();
    setSaving(false);
  };

  /** Drop on the strip above a row: insert dragged item right before that row. */
  const dropBefore = async (targetId: string) => {
    const src = dragId.current;
    dragId.current = null;
    if (!src || src === targetId || saving) return;
    if (isDescendant(targetId, src)) return; // never drop into your own subtree
    const target = items.find((i) => i.id === targetId);
    const srcItem = items.find((i) => i.id === src);
    if (!target || !srcItem) return;
    setSaving(true);
    await persistOrder(srcItem.parent_id, siblingsOf(srcItem.parent_id, src).map((i) => i.id));
    const newSibs = siblingsOf(target.parent_id, src);
    const at = newSibs.findIndex((i) => i.id === targetId);
    newSibs.splice(at < 0 ? newSibs.length : at, 0, srcItem);
    await persistOrder(target.parent_id, newSibs.map((i) => i.id));
    await load();
    setSaving(false);
  };

  /** Drop on a row body (or the root zone with null): make it a child of that row. */
  const dropInto = async (parentId: string | null) => {
    const src = dragId.current;
    dragId.current = null;
    if (!src || src === parentId || saving) return;
    if (parentId && isDescendant(parentId, src)) return;
    const srcItem = items.find((i) => i.id === src);
    if (!srcItem || srcItem.parent_id === parentId) return;
    setSaving(true);
    await persistOrder(srcItem.parent_id, siblingsOf(srcItem.parent_id, src).map((i) => i.id));
    const newSibs = siblingsOf(parentId, src);
    newSibs.push(srcItem);
    await persistOrder(parentId, newSibs.map((i) => i.id));
    await load();
    setSaving(false);
  };

  /**
   * Syncs the built-in site menu into the table WITHOUT creating duplicates:
   * only entries that are not already stored (same parent + label + link) are
   * inserted. Running it twice is a no-op.
   */
  const importCurrent = async () => {
    if (saving) return;
    setSaving(true);
    const { data } = await adminDb("site_menu_items").select("*");
    const existing = (data as MenuItem[]) || [];
    const keyOf = (parent_id: string | null, label: string, href: string | null) =>
      `${parent_id ?? ""}|${label.trim()}|${(href ?? "").trim()}`;
    const byKey = new Map<string, MenuItem>();
    for (const r of existing) byKey.set(keyOf(r.parent_id, r.label, r.href), r);

    const rows: Record<string, unknown>[] = [];
    const walk = (list: NavItem[], parent_id: string | null) => {
      list.forEach((n, i) => {
        const key = keyOf(parent_id, n.label, n.href ?? null);
        let id = byKey.get(key)?.id;
        if (!id) {
          id = crypto.randomUUID();
          rows.push({
            id,
            parent_id,
            label: n.label,
            href: n.href ?? null,
            position: i,
            device: "both",
            is_active: true,
          });
          byKey.set(key, { id, parent_id, label: n.label, href: n.href ?? null } as MenuItem);
        }
        if (n.children?.length) walk(n.children, id);
      });
    };
    walk(navItems, null);
    if (rows.length) await adminDb("site_menu_items").insert(rows);
    await load();
    setSaving(false);
    alert(rows.length ? `${rows.length} آیتم تازه اضافه شد.` : "همه آیتم‌ها از قبل موجود بودند.");
  };

  /** Removes rows that repeat the same parent + label + link, keeping the first. */
  const cleanupDuplicates = async () => {
    if (saving) return;
    if (!confirm("آیتم‌های تکراری منو حذف شوند؟")) return;
    setSaving(true);
    const { data } = await adminDb("site_menu_items").select("*").order("position", { ascending: true });
    const rows = (data as MenuItem[]) || [];
    const seen = new Map<string, string>();
    const remap = new Map<string, string>(); // duplicate id -> kept id
    const doomed: string[] = [];
    for (const r of rows) {
      const key = `${r.parent_id ?? ""}|${r.label.trim()}|${(r.href ?? "").trim()}`;
      const kept = seen.get(key);
      if (kept) {
        remap.set(r.id, kept);
        doomed.push(r.id);
      } else {
        seen.set(key, r.id);
      }
    }
    // Re-parent children of removed rows onto the surviving twin, then delete.
    for (const r of rows) {
      if (r.parent_id && remap.has(r.parent_id) && !remap.has(r.id)) {
        await adminDb("site_menu_items").update({ parent_id: remap.get(r.parent_id) } as any).eq("id", r.id);
      }
    }
    for (const id of doomed) {
      await adminDb("site_menu_items").delete().eq("id", id);
    }
    await load();
    setSaving(false);
    alert(doomed.length ? `${doomed.length} آیتم تکراری حذف شد.` : "آیتم تکراری پیدا نشد.");
  };

  const dnd = {
    onDragStart: (id: string) => { dragId.current = id; },
    dropBefore,
    dropInto,
  };

  return (
    <PaneShell title="ویرایش برگها (دسکتاپ/موبایل/تبلت)" onRefresh={load}
      extra={
        <div className="flex items-center gap-2">
          <DeviceToggle value={device} onChange={setDevice} />
          <button onClick={importCurrent} disabled={saving}
            className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 bg-white disabled:opacity-50">
            همگام‌سازی با منوی سایت
          </button>
          <button onClick={cleanupDuplicates} disabled={saving}
            className="text-xs font-bold px-3 py-2 rounded-xl border border-rose-300 text-rose-600 bg-white disabled:opacity-50">
            حذف آیتم‌های تکراری
          </button>
          <button onClick={() => add(null)} disabled={saving}
            className="flex items-center gap-1.5 bg-[#0b1e3f] hover:bg-[#122b57] text-white text-xs font-bold px-3 py-2 rounded-xl transition disabled:opacity-50">
            <Plus className="w-4 h-4" /> افزودن آیتم اصلی
          </button>
        </div>
      }
    >
      {loading ? <Empty text="در حال بارگذاری..." /> : roots.length === 0 ? (
        <Empty text="هنوز آیتمی برای این نما تعریف نشده — با «افزودن آیتم اصلی» شروع کنید." />
      ) : (
        <>
          <p className="text-[11px] text-slate-500 mb-2">
            برای جابجایی، دستهٔ ⋮⋮ را بکشید: رها روی خط نازک بالای هر آیتم = مرتب‌سازی، رها روی خود آیتم = تبدیل به زیرمجموعه. دکمه‌های ↑ ↓ هم مرتب‌سازی می‌کنند.
          </p>
          <ul className="space-y-2">
            {roots.map((r) => (
              <MenuRow key={r.id} item={r} depth={0} saving={saving} dnd={dnd}
                onUpdate={update} onDelete={del} onAddChild={add} onMove={move} childrenOf={childrenOf} />
            ))}
          </ul>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); dropInto(null); }}
            className="mt-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-center text-[11px] text-slate-400"
          >
            برای انتقال یک آیتم به سطح اصلی، آن را اینجا رها کنید
          </div>
        </>
      )}
    </PaneShell>
  );
}

type MenuDnd = {
  onDragStart: (id: string) => void;
  dropBefore: (targetId: string) => void;
  dropInto: (parentId: string | null) => void;
};

function MenuRow({
  item, depth, saving, dnd, onUpdate, onDelete, onAddChild, onMove, childrenOf,
}: {
  item: MenuItem; depth: number; saving: boolean; dnd: MenuDnd;
  onUpdate: (id: string, patch: Partial<MenuItem>) => void;
  onDelete: (id: string) => void;
  onAddChild: (parent_id: string) => void;
  onMove: (item: MenuItem, dir: -1 | 1) => void;
  childrenOf: (id: string) => MenuItem[];
}) {
  const [label, setLabel] = useState(item.label);
  const [href, setHref] = useState(item.href || "");
  const [dragOver, setDragOver] = useState(false);
  const kids = childrenOf(item.id);
  const dirty = label !== item.label || (href || "") !== (item.href || "");

  return (
    <li>
      {/* Reorder drop strip: drop here = insert before this row */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); dnd.dropBefore(item.id); }}
        className="h-1.5 rounded-full bg-transparent hover:bg-[#0b1e3f]/20 transition"
      />
      <div style={{ paddingRight: depth * 12 }}>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); dnd.dropInto(item.id); }}
          className={`flex flex-wrap items-center gap-2 bg-white rounded-xl border p-2.5 transition ${dragOver ? "border-[#0b1e3f] ring-2 ring-[#0b1e3f]/20" : "border-slate-200 hover:border-[#0b1e3f]/40"}`}
        >
          <span
            draggable
            onDragStart={() => dnd.onDragStart(item.id)}
            title="برای جابجایی بکشید"
            className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-[#0b1e3f] transition"
          >
            <GripVertical className="w-4 h-4" />
          </span>
          <span className="w-6 h-6 rounded-md bg-slate-100 grid place-items-center text-[10px] font-bold text-slate-500">{item.position + 1}</span>
          <input value={label} onChange={(e) => setLabel(e.target.value)}
            className="flex-1 min-w-[130px] px-2 py-1.5 text-sm rounded-lg border border-slate-200 focus:border-[#0b1e3f] outline-none" />
          <input value={href} onChange={(e) => setHref(e.target.value)} placeholder="/link" dir="ltr"
            className="w-full sm:w-40 px-2 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-[#0b1e3f] outline-none" />
          <select value={item.device} disabled={saving} onChange={(e) => onUpdate(item.id, { device: e.target.value as MenuDevice })}
            className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1.5 disabled:opacity-50">
            <option value="both">همه نماها</option>
            <option value="desktop">دسکتاپ</option>
            <option value="mobile">موبایل</option>
            <option value="tablet">تبلت</option>
          </select>
          <label className="flex items-center gap-1 text-xs text-slate-600">
            <input type="checkbox" disabled={saving} checked={item.is_active} onChange={(e) => onUpdate(item.id, { is_active: e.target.checked })} />
            فعال
          </label>
          <IconBtn onClick={() => onMove(item, -1)}><ArrowUp className="w-4 h-4" /></IconBtn>
          <IconBtn onClick={() => onMove(item, 1)}><ArrowDown className="w-4 h-4" /></IconBtn>
          {dirty && (
            <IconBtn tone="primary" disabled={saving} onClick={() => onUpdate(item.id, { label, href: href || null })}>
              <Save className="w-4 h-4" />
            </IconBtn>
          )}
          <IconBtn disabled={saving} onClick={() => onAddChild(item.id)}><Plus className="w-4 h-4" /></IconBtn>
          <IconBtn tone="danger" disabled={saving} onClick={() => onDelete(item.id)}><Trash2 className="w-4 h-4" /></IconBtn>
        </div>
      </div>
      {kids.length > 0 && (
        <ul className="mt-2 space-y-2">
          {kids.map((k) => (
            <MenuRow key={k.id} item={k} depth={depth + 1} saving={saving} dnd={dnd}
              onUpdate={onUpdate} onDelete={onDelete} onAddChild={onAddChild} onMove={onMove} childrenOf={childrenOf} />
          ))}
        </ul>
      )}
    </li>
  );
}

/* ---------- Footer Editor ---------- */
function FooterPane() {
  const [sections, setSections] = useState<FooterSection[]>([]);
  const [links, setLinks] = useState<FooterLink[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [s, l] = await Promise.all([
      adminDb("site_footer_sections").select("*").order("position", { ascending: true }),
      adminDb("site_footer_links").select("*").order("position", { ascending: true }),
    ]);
    setSections((s.data as FooterSection[]) || []);
    setLinks((l.data as FooterLink[]) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const addSection = async () => {
    const title = prompt("عنوان ستون فوتر:");
    if (!title) return;
    await adminDb("site_footer_sections").insert({ title, position: sections.length, is_active: true } as any);
    load();
  };
  const updateSection = async (id: string, patch: Partial<FooterSection>) => {
    await adminDb("site_footer_sections").update(patch as any).eq("id", id); load();
  };
  const delSection = async (id: string) => {
    if (!confirm("این ستون و همه لینک‌هایش حذف شود؟")) return;
    await adminDb("site_footer_sections").delete().eq("id", id); load();
  };
  const addLink = async (section_id: string) => {
    const label = prompt("عنوان لینک:"); if (!label) return;
    const href = prompt("آدرس لینک:") || "#";
    const siblings = links.filter((l) => l.section_id === section_id);
    await adminDb("site_footer_links").insert({ section_id, label, href, position: siblings.length } as any);
    load();
  };
  const updateLink = async (id: string, patch: Partial<FooterLink>) => {
    await adminDb("site_footer_links").update(patch as any).eq("id", id); load();
  };
  const delLink = async (id: string) => {
    await adminDb("site_footer_links").delete().eq("id", id); load();
  };

  return (
    <PaneShell title="مدیریت فوتر" onRefresh={load}
      extra={
        <button onClick={addSection}
          className="flex items-center gap-1.5 bg-[#0b1e3f] hover:bg-[#122b57] text-white text-xs font-bold px-3 py-2 rounded-xl transition">
          <Plus className="w-4 h-4" /> ستون جدید
        </button>
      }
    >
      {loading ? <Empty text="در حال بارگذاری..." /> : sections.length === 0 ? (
        <Empty text="هنوز ستونی تعریف نشده — با «ستون جدید» شروع کنید." />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {sections.map((s) => (
            <div key={s.id} className="bg-white border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <input value={s.title} onChange={(e) => setSections((prev) => prev.map((x) => x.id === s.id ? { ...x, title: e.target.value } : x))}
                  onBlur={(e) => e.target.value !== s.title && updateSection(s.id, { title: e.target.value })}
                  className="flex-1 font-bold text-[#0b1e3f] px-2 py-1.5 rounded-lg border border-slate-200 focus:border-[#0b1e3f] outline-none" />
                <IconBtn onClick={() => addLink(s.id)}><Plus className="w-4 h-4" /></IconBtn>
                <IconBtn tone="danger" onClick={() => delSection(s.id)}><Trash2 className="w-4 h-4" /></IconBtn>
              </div>
              <ul className="space-y-2">
                {links.filter((l) => l.section_id === s.id).map((l) => (
                  <li key={l.id} className="flex items-center gap-2">
                    <input defaultValue={l.label} onBlur={(e) => e.target.value !== l.label && updateLink(l.id, { label: e.target.value })}
                      className="flex-1 text-sm px-2 py-1.5 rounded-lg border border-slate-200 focus:border-[#0b1e3f] outline-none" />
                    <input defaultValue={l.href} dir="ltr" onBlur={(e) => e.target.value !== l.href && updateLink(l.id, { href: e.target.value })}
                      className="w-40 text-xs px-2 py-1.5 rounded-lg border border-slate-200 focus:border-[#0b1e3f] outline-none" />
                    <IconBtn tone="danger" onClick={() => delLink(l.id)}><Trash2 className="w-3.5 h-3.5" /></IconBtn>
                  </li>
                ))}
                {links.filter((l) => l.section_id === s.id).length === 0 && (
                  <li className="text-xs text-slate-400 text-center py-2">هنوز لینکی اضافه نشده.</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      )}
    </PaneShell>
  );
}

/* ---------- Small UI helpers ---------- */
function PaneShell({ title, children, onRefresh, extra }: {
  title: string; children: React.ReactNode; onRefresh?: () => void; extra?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-xl md:text-2xl font-extrabold text-[#0b1e3f]">{title}</h1>
        <div className="flex items-center gap-2">
          {extra}
          {onRefresh && (
            <button onClick={onRefresh}
              className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl transition">
              <RefreshCw className="w-3.5 h-3.5" /> به‌روزرسانی
            </button>
          )}
        </div>
      </div>
      <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-4 md:p-6">
        {children}
      </div>
    </div>
  );
}

function DeviceToggle({ value, onChange }: { value: "desktop" | "mobile" | "tablet"; onChange: (v: "desktop" | "mobile" | "tablet") => void }) {
  return (
    <div className="inline-flex bg-slate-100 rounded-xl p-1 text-xs font-bold">
      <button onClick={() => onChange("desktop")}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition ${value === "desktop" ? "bg-white text-[#0b1e3f] shadow" : "text-slate-500"}`}>
        <Monitor className="w-3.5 h-3.5" /> دسکتاپ
      </button>
      <button onClick={() => onChange("mobile")}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition ${value === "mobile" ? "bg-white text-[#0b1e3f] shadow" : "text-slate-500"}`}>
        <Smartphone className="w-3.5 h-3.5" /> موبایل
      </button>
      <button onClick={() => onChange("tablet")}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition ${value === "tablet" ? "bg-white text-[#0b1e3f] shadow" : "text-slate-500"}`}>
        <Tablet className="w-3.5 h-3.5" /> تبلت
      </button>
    </div>
  );
}

function IconBtn({ children, onClick, tone = "default", disabled = false }: {
  children: React.ReactNode; onClick?: () => void; tone?: "default" | "danger" | "primary"; disabled?: boolean;
}) {
  const toneCls =
    tone === "danger" ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
    : tone === "primary" ? "bg-[#0b1e3f] text-white hover:bg-[#122b57]"
    : "bg-slate-100 text-slate-600 hover:bg-slate-200";
  return (
    <button disabled={disabled} type="button" onClick={onClick}
      className={`w-8 h-8 grid place-items-center rounded-lg transition ${toneCls}`}>
      {children}
    </button>
  );
}

function Th({ children }: { children?: React.ReactNode }) {
  return <th className="text-right px-3 py-2.5 font-semibold text-xs">{children}</th>;
}
function Td({ children, className = "", dir }: { children?: React.ReactNode; className?: string; dir?: string }) {
  return <td dir={dir} className={`px-3 py-2.5 whitespace-nowrap ${className}`}>{children}</td>;
}
function Empty({ text }: { text: string }) {
  return <div className="text-center text-sm text-slate-400 py-16">{text}</div>;
}
