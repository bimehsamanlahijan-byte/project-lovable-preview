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
      { title: "ظ¾غŒط´ط®ظˆط§ظ† ظ…ط¯غŒط±غŒطھ | ط¨غŒظ…ظ‡ ط³ط§ظ…ط§ظ† â€” ظ†ظ…ط§غŒظ†ط¯ع¯غŒ ط¢ط°ط±ط®ط´" },
      { name: "description", content: "ظ¾غŒط´ط®ظˆط§ظ† ظ…ط¯غŒط±غŒطھ ظ…ط­طھظˆط§غŒ ظˆط¨â€Œط³ط§غŒطھ" },
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
type MenuItem = {
  id: string; label: string; href: string | null; parent_id: string | null;
  position: number; device: "desktop" | "mobile" | "both"; is_active: boolean;
};
type FooterSection = { id: string; title: string; position: number; is_active: boolean };
type FooterLink = { id: string; section_id: string; label: string; href: string; position: number };

type TabKey =
  | "overview"
  | "editor"
  | "inspector"
  | "contacts"
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
    { key: "overview", label: "ظ¾غŒط´ط®ظˆط§ظ†", icon: LayoutDashboard },
    { key: "editor", label: "ظˆغŒط±ط§غŒط´ع¯ط± ط¨طµط±غŒ ط³ط§غŒطھ", icon: Wand2 },
    { key: "inspector", label: "ظ…ظˆط³ ط§غŒط±ط§ط¯غŒط§ط¨ ظˆ ع©ط¯غŒط§ط¨", icon: Bug },
    { key: "contacts", label: "ط¯ط±ط®ظˆط§ط³طھâ€Œظ‡ط§غŒ ظ…ط´ط§ظˆط±ظ‡", icon: MessageSquare },
    { key: "damages", label: "ع¯ط²ط§ط±ط´â€Œظ‡ط§غŒ ط®ط³ط§ط±طھ", icon: AlertTriangle },
    { key: "menu", label: "ظ…ظ†ظˆغŒ ظ‡ط¯ط± (ط¯ط³ع©طھط§ظ¾/ظ…ظˆط¨ط§غŒظ„)", icon: MenuIcon },
    { key: "footer", label: "ظپظˆطھط± ظˆ ط³طھظˆظ†â€Œظ‡ط§", icon: PanelBottom },
    { key: "social", label: "ط´ط¨ع©ظ‡â€Œظ‡ط§غŒ ط§ط¬طھظ…ط§ط¹غŒ", icon: Share2 },
    { key: "ai", label: "ع†طھ ظ‡ظˆط´ ظ…طµظ†ظˆط¹غŒ", icon: Bot },
    { key: "chat", label: "ع†طھ ط±ظˆظ… ط¢ظ†ظ„ط§غŒظ†", icon: MessagesSquare },
    { key: "docs", label: "ظ…ط®ط²ظ† ظ…ط¯ط§ط±ع© ظ…ط´طھط±غŒط§ظ†", icon: FolderOpen },
    { key: "branding", label: "ظ„ظˆع¯ظˆطŒ ط¢غŒع©ظ†â€Œظ‡ط§ ظˆ ط¹ظ†ظˆط§ظ†", icon: ImageIcon },
    { key: "medialib", label: "ع©طھط§ط¨ط®ط§ظ†ظ‡ ط±ط³ط§ظ†ظ‡ (ط¹ع©ط³/ظˆغŒط¯ط¦ظˆ)", icon: ImageIcon },
    { key: "backend", label: "ط§طھطµط§ظ„ Supabase (ط¯غŒطھط§ط¨غŒط³ ظˆ ظپط§غŒظ„)", icon: Database },
    { key: "telegram", label: "ط±ط¨ط§طھ طھظ„ع¯ط±ط§ظ… ظˆ ط§طھظˆظ…ط§ط³غŒظˆظ†", icon: Send },
    { key: "seo", label: "ط³ط¦ظˆ ظˆ ظ†طھط§غŒط¬ ع¯ظˆع¯ظ„", icon: SearchIcon },
    { key: "deploy", label: "ط§ظ†طھط´ط§ط± ط¯ط± Cloudflare", icon: Cloud },
    { key: "github", label: "ط§طھطµط§ظ„ ع¯غŒطھâ€Œظ‡ط§ط¨", icon: Github },
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
                alt="ظ¾غŒط´ط®ظˆط§ظ† ظ…ط¯غŒط±غŒطھ"
                style={{ height: branding.logoHeightDashboard }}
                className="w-auto object-contain rounded-lg bg-white/95 p-1"
              />
              <div className="leading-tight">
                <div className="font-extrabold text-sm">ظ¾غŒط´ط®ظˆط§ظ† ظ…ط¯غŒط±غŒطھ</div>
                <div className="text-[11px] opacity-70">ط¨غŒظ…ظ‡ ط³ط§ظ…ط§ظ† â€” ظ†ظ…ط§غŒظ†ط¯ع¯غŒ ط¢ط°ط±ط®ط´</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={async () => { await lockDashboard(); window.location.href = "/"; }}
              className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> ط®ط±ظˆط¬
            </button>
            <a href="/" className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition">ظ…ط´ط§ظ‡ط¯ظ‡ ط³ط§غŒطھ</a>
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
        setError("ط±ظ…ط² ظ¾غŒط´ط®ظˆط§ظ† ط±ظˆغŒ ط³ط±ظˆط± طھظ†ط¸غŒظ… ظ†ط´ط¯ظ‡ ط§ط³طھ (DASHBOARD_PASSWORD).");
      else if (res.reason === "no-session-secret")
        setError("ظ…طھط؛غŒط± SESSION_SECRET ط±ظˆغŒ ط³ط±ظˆط± طھظ†ط¸غŒظ… ظ†ط´ط¯ظ‡ ط§ط³طھ.");
      else if (res.reason === "server-error")
        setError(res.message ?? "ط®ط·ط§غŒ ط³ط±ظˆط± ط¯ط± ط¨ط±ط±ط³غŒ ط±ظ…ط².");
      else setError("ط±ظ…ط² ظˆط±ظˆط¯ ظ†ط§ط¯ط±ط³طھ ط§ط³طھ.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "ط§ط±طھط¨ط§ط· ط¨ط§ ط³ط±ظˆط± ط¨ط±ظ‚ط±ط§ط± ظ†ط´ط¯.");
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
        <h1 className="text-lg font-extrabold text-[#0b1e3f] text-center">ظˆط±ظˆط¯ ط¨ظ‡ ظ¾غŒط´ط®ظˆط§ظ†</h1>
        <p className="text-xs text-slate-500 text-center mt-1 mb-6">ط±ظ…ط² ظˆط±ظˆط¯ ط±ط§ ظˆط§ط±ط¯ ع©ظ†غŒط¯.</p>
        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="ط±ظ…ط² ظˆط±ظˆط¯"
            autoFocus
            className="w-full text-sm rounded-xl border border-slate-300 px-4 py-3 ps-12 text-center"
            dir="ltr"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "ظ¾ظ†ظ‡ط§ظ† ع©ط±ط¯ظ† ط±ظ…ط²" : "ظ†ظ…ط§غŒط´ ط±ظ…ط²"}
            title={showPassword ? "ظ¾ظ†ظ‡ط§ظ† ع©ط±ط¯ظ† ط±ظ…ط²" : "ظ†ظ…ط§غŒط´ ط±ظ…ط²"}
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
          {busy ? "ط¯ط± ط­ط§ظ„ ط¨ط±ط±ط³غŒ..." : "ظˆط±ظˆط¯"}
        </button>
      </form>
    </div>
  );
}

/* ---------- Visual editor ---------- */


const FONT_OPTIONS = [
  { v: "", label: "ظ¾غŒط´â€Œظپط±ط¶ ظ‚ط§ظ„ط¨" },
  { v: "Vazirmatn, sans-serif", label: "ظˆط²غŒط±ظ…طھظ†" },
  { v: "IRANSans, Vazirmatn, sans-serif", label: "ط§غŒط±ط§ظ†â€Œط³ظ†ط³" },
  { v: "Tahoma, sans-serif", label: "Tahoma" },
  { v: "Georgia, serif", label: "Georgia" },
  { v: "monospace", label: "Monospace" },
];

/** Ready-made blocks that can be inserted after any selected element. */
const BLOCK_TEMPLATES: { key: string; label: string; html: string }[] = [
  {
    key: "text",
    label: "ط³ع©ط´ظ† ظ…طھظ†غŒ ط³ط§ط¯ظ‡",
    html: `<section style="padding:32px 16px;text-align:center"><h2 style="font-weight:800;font-size:22px;color:#0b1e3f">ط¹ظ†ظˆط§ظ† ط³ع©ط´ظ† ط¬ط¯غŒط¯</h2><p style="margin-top:8px;color:#475569;font-size:14px">ظ…طھظ† طھظˆط¶غŒط­غŒ ط§غŒظ† ط¨ط®ط´ ط±ط§ ط§ط² ظ‡ظ…غŒظ†â€Œط¬ط§ ظˆغŒط±ط§غŒط´ ع©ظ†غŒط¯.</p></section>`,
  },
  {
    key: "cta",
    label: "ط¨ظ†ط± ظپط±ط§ط®ظˆط§ظ† ط¨ط§ ط¯ع©ظ…ظ‡",
    html: `<section style="margin:24px 16px;padding:28px;border-radius:24px;background:linear-gradient(120deg,#0b1e3f,#c81e35);color:#fff;text-align:center"><h2 style="font-weight:800;font-size:20px">ظ‡ظ…غŒظ† ط­ط§ظ„ط§ ظ…ط´ط§ظˆط±ظ‡ ط±ط§غŒع¯ط§ظ† ط¨ع¯غŒط±غŒط¯</h2><p style="margin-top:8px;font-size:13px;opacity:.9">ع©ط§ط±ط´ظ†ط§ط³ط§ظ† ظ†ظ…ط§غŒظ†ط¯ع¯غŒ ط¢ط°ط±ط®ط´ ظ¾ط§ط³ط®ع¯ظˆغŒ ط´ظ…ط§ ظ‡ط³طھظ†ط¯.</p><a href="/contact" style="display:inline-block;margin-top:14px;background:#fff;color:#0b1e3f;font-weight:800;font-size:13px;padding:10px 22px;border-radius:999px">طھظ…ط§ط³ ط¨ط§ ظ…ط§</a></section>`,
  },
  {
    key: "cards",
    label: "ط³ظ‡ ع©ط§ط±طھ ع©ظ†ط§ط± ظ‡ظ…",
    html: `<section style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding:24px 16px">${[1, 2, 3]
      .map(
        (i) =>
          `<div style="background:#fff;border:1px solid #e2e8f0;border-radius:18px;padding:18px;text-align:center"><h3 style="font-weight:800;color:#0b1e3f;font-size:15px">ط¹ظ†ظˆط§ظ† ${i}</h3><p style="margin-top:6px;color:#64748b;font-size:12px">طھظˆط¶غŒط­ ع©ظˆطھط§ظ‡</p></div>`,
      )
      .join("")}</section>`,
  },
  {
    key: "divider",
    label: "ط¬ط¯ط§ع©ظ†ظ†ط¯ظ‡",
    html: `<div style="height:1px;background:#e2e8f0;margin:24px 16px"></div>`,
  },
  {
    key: "image",
    label: "طھطµظˆغŒط± طھظ…ط§ظ…â€Œط¹ط±ط¶",
    html: `<section style="padding:16px"><img src="${headerLogo}" alt="ط¨غŒظ…ظ‡ ط³ط§ظ…ط§ظ†" style="width:100%;border-radius:20px;object-fit:cover" /></section>`,
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


  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
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
        void adminWriteSetting(VE_SETTING_KEY, { map: m.map });
        setPublished(true);
        window.setTimeout(() => setPublished(false), 2000);
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

  /* On phones the settings panel sits under the preview â€” bring it into view. */
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
        <h1 className="text-xl font-extrabold text-[#0b1e3f]">ظˆغŒط±ط§غŒط´ع¯ط± ط¨طµط±غŒ ط³ط§غŒطھ</h1>
        <p className="text-xs text-slate-500 mt-1 leading-6">
          ط±ظˆغŒ ظ‡ط± ط¹ظ†طµط± ط¯ط§ط®ظ„ ط³ط§غŒطھ ع©ظ„غŒع© ع©ظ†غŒط¯ ظˆ ظپظˆظ†طھطŒ ط±ظ†ع¯طŒ ط´ظپط§ظپغŒطھطŒ ط§ظ†غŒظ…غŒط´ظ†طŒ ظ…طھظ†طŒ ط¢غŒع©ظ†/SVG ظˆ ظ„غŒظ†ع© ط¢ظ† ط±ط§ طھط؛غŒغŒط± ط¯ظ‡غŒط¯.
        </p>
      </div>

      <div className="flex flex-wrap rounded-xl overflow-hidden border border-slate-300 bg-white w-fit mb-4">
        <button onClick={() => setTab("elements")}
          className={`px-4 py-2 text-xs font-bold ${tab === "elements" ? "bg-[#0b1e3f] text-white" : ""}`}>
          ظˆغŒط±ط§غŒط´ ط¹ظ†ط§طµط± طµظپط­ظ‡
        </button>
        <button onClick={() => setTab("media")}
          className={`px-4 py-2 text-xs font-bold ${tab === "media" ? "bg-[#0b1e3f] text-white" : ""}`}>
          ط§ط³ظ„ط§غŒط¯ط± ظˆ ط§ظ†غŒظ…غŒط´ظ†â€Œظ‡ط§
        </button>
        <button onClick={() => setTab("wheel")}
          className={`px-4 py-2 text-xs font-bold ${tab === "wheel" ? "bg-[#0b1e3f] text-white" : ""}`}>
          ع†ط±ط®â€Œظˆظپظ„ع© ظˆ ط¯ع©ظ…ظ‡ ط®ط±غŒط¯
        </button>
        <button onClick={() => setTab("menus")}
          className={`px-4 py-2 text-xs font-bold ${tab === "menus" ? "bg-[#0b1e3f] text-white" : ""}`}>
          ظ…ظ†ظˆظ‡ط§ (ط§ظپط²ظˆط¯ظ†/ط­ط°ظپ)
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
          <button onClick={() => setDevice("desktop")}
            className={`px-3 py-2 text-xs flex items-center gap-1.5 ${device === "desktop" ? "bg-[#0b1e3f] text-white" : ""}`}>
            <Monitor className="w-3.5 h-3.5" /> ط¯ط³ع©طھط§ظ¾
          </button>
          <button onClick={() => setDevice("mobile")}
            className={`px-3 py-2 text-xs flex items-center gap-1.5 ${device === "mobile" ? "bg-[#0b1e3f] text-white" : ""}`}>
            <Smartphone className="w-3.5 h-3.5" /> ظ…ظˆط¨ط§غŒظ„
          </button>
        </div>
        <div className="flex rounded-xl overflow-hidden border border-slate-300 bg-white">
          <button onClick={() => setMode("select")}
            className={`px-3 py-2 text-xs font-bold ${mode === "select" ? "bg-[#0b1e3f] text-white" : ""}`}>
            ط­ط§ظ„طھ ط§ظ†طھط®ط§ط¨
          </button>
          <button onClick={() => setMode("interact")}
            className={`px-3 py-2 text-xs font-bold ${mode === "interact" ? "bg-[#0b1e3f] text-white" : ""}`}>
            ط­ط§ظ„طھ طھط¹ط§ظ…ظ„
          </button>
        </div>
        <button
          onClick={() => { if (frame.current) frame.current.src = `${page}?ve=1&t=${Date.now()}`; }}
          className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> ط¨ط§ط²ط®ظˆط§ظ†غŒ
        </button>
        <button
          onClick={() => setWide((w) => !w)}
          className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
        >
          {wide ? "ظ†ظ…ط§غŒ ظ…ط¹ظ…ظˆظ„غŒ" : "ظ†ظ…ط§غŒ ط¨ط²ط±ع¯"}
        </button>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const p = customPath.trim();
            if (!p) return;
            const path = p.startsWith("/") ? p : `/${p}`;
            setPage(path);
            setSel(null);
            if (frame.current) frame.current.src = `${path}?ve=1&t=${Date.now()}`;
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
            ط¨ط§ط² ع©ظ†
          </button>
        </form>
        {published && (
          <span className="text-[11px] text-emerald-600 font-bold px-2">ط±ظˆغŒ ط³ط§غŒطھ ظ…ظ†طھط´ط± ط´ط¯ âœ“</span>
        )}
        <button
          onClick={() => { if (confirm("ظ‡ظ…ظ‡ طھط؛غŒغŒط±ط§طھ ط¸ط§ظ‡ط±غŒ ط­ط°ظپ ط´ظˆط¯طں")) send({ type: "ve:resetAll" }); }}
          className="px-3 py-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 text-xs flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" /> ط¨ط§ط²ظ†ط´ط§ظ†غŒ ع©ظ„ طھط؛غŒغŒط±ط§طھ
        </button>
        <span className="text-[11px] text-slate-500 font-mono px-2" dir="ltr">{currentPath}</span>
      </div>

      <p className="text-[11px] text-slate-500 mb-3 leading-6">
        ط¯ط± آ«ط­ط§ظ„طھ طھط¹ط§ظ…ظ„آ» ط³ط§غŒطھ ط¯ظ‚غŒظ‚ط§ظ‹ ظ…ط«ظ„ ط­ط§ظ„طھ ظˆط§ظ‚ط¹غŒ ع©ط§ط± ظ…غŒâ€Œع©ظ†ط¯ (ط¯ع©ظ…ظ‡ ط®ط±غŒط¯ ط¢ظ†ظ„ط§غŒظ†طŒ ع†ط±ط®â€Œظˆظپظ„ع©طŒ ط§ط³ظ„ط§غŒط¯ط± ظˆ ظ…ظ†ظˆظ‡ط§)ط›
        ط¨ط±ط§غŒ ط§ظ†طھط®ط§ط¨ غŒع© ط¹ظ†طµط± ط¯ط± ط§غŒظ† ط­ط§ظ„طھطŒ ط¯ط± ع©ط§ظ…ظ¾غŒظˆطھط± ع©ظ„غŒط¯ Alt ط±ط§ ظ†ع¯ظ‡ ط¯ط§ط±غŒط¯ ظˆ ع©ظ„غŒع© ع©ظ†غŒط¯ ظˆ ط¯ط± ظ…ظˆط¨ط§غŒظ„ ط§ظ†ع¯ط´طھ ط®ظˆط¯ ط±ط§ ط±ظˆغŒ ط¹ظ†طµط± ظ†ع¯ظ‡ ط¯ط§ط±غŒط¯ (ظ„ظ…ط³ ط·ظˆظ„ط§ظ†غŒ).
      </p>

      <div className={wide ? "grid gap-4" : "grid lg:grid-cols-[1fr_320px] gap-4"}>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className={device === "mobile" ? "mx-auto w-full max-w-[390px]" : "w-full"}>
            <iframe
              ref={frame}
              src={`${page}?ve=1`}
              title="preview"
              className={`w-full border-0 bg-white ${wide ? "h-[85vh]" : "h-[70vh]"}`}
            />

          </div>
        </div>

        <aside ref={panel} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 h-fit lg:sticky lg:top-24">
          {!sel ? (
            <p className="text-xs text-slate-500 leading-6">
              ط¨ط±ط§غŒ ط´ط±ظˆط¹طŒ ط¯ط§ط®ظ„ ظ¾غŒط´â€Œظ†ظ…ط§غŒط´ ط±ظˆغŒ ط¹ظ†طµط± ظ…ظˆط±ط¯ ظ†ط¸ط± ع©ظ„غŒع© ع©ظ†غŒط¯.
            </p>
          ) : (
            <div className="space-y-3">
              <div className="text-[11px] text-slate-500 break-all bg-slate-50 rounded-lg p-2 font-mono" dir="ltr">
                &lt;{sel.tag}&gt;
              </div>

              {sel.text !== "" && (
                <Field label="ظ…طھظ†">
                  <textarea rows={3} value={draft.text ?? ""} onChange={(e) => field("text", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm" />
                </Field>
              )}

              <Field label="ط¢غŒع©ظ† / SVG / ظ…ط­طھظˆط§غŒ HTML">
                <textarea rows={3} value={draft.html ?? ""} onChange={(e) => field("html", e.target.value)}
                  dir="ltr" className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono" />
              </Field>

              <Field label="ظ„غŒظ†ع© (href)">
                <input value={draft.href ?? ""} onChange={(e) => field("href", e.target.value)} dir="ltr"
                  placeholder="/contact غŒط§ https://..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm" />
              </Field>

              <div className="grid grid-cols-2 gap-2">
                <Field label="ط¨ط§ط² ط´ط¯ظ†">
                  <select value={draft.target ?? ""} onChange={(e) => field("target", e.target.value)}
                    className="w-full px-2 py-2 rounded-xl border border-slate-300 text-xs">
                    <option value="">ظ‡ظ…غŒظ† طھط¨</option>
                    <option value="_blank">طھط¨ ط¬ط¯غŒط¯</option>
                  </select>
                </Field>
                <Field label="rel (ط¨ع©â€Œظ„غŒظ†ع©)">
                  <select value={draft.rel ?? ""} onChange={(e) => field("rel", e.target.value)}
                    className="w-full px-2 py-2 rounded-xl border border-slate-300 text-xs">
                    <option value="">ظ¾غŒط´â€Œظپط±ط¶</option>
                    <option value="dofollow">dofollow</option>
                    <option value="nofollow">nofollow</option>
                    <option value="noopener noreferrer">noopener noreferrer</option>
                  </select>
                </Field>
              </div>

              <Field label="ظپظˆظ†طھ">
                <select value={draft["font-family"] ?? ""} onChange={(e) => field("font-family", e.target.value)}
                  className="w-full px-2 py-2 rounded-xl border border-slate-300 text-xs">
                  {FONT_OPTIONS.map((f) => <option key={f.label} value={f.v}>{f.label}</option>)}
                </select>
              </Field>

              <div className="grid grid-cols-2 gap-2">
                <Field label="ط§ظ†ط¯ط§ط²ظ‡ ظپظˆظ†طھ">
                  <input value={draft["font-size"] ?? ""} onChange={(e) => field("font-size", e.target.value)} dir="ltr"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm" />
                </Field>
                <Field label="ط¶ط®ط§ظ…طھ">
                  <select value={draft["font-weight"] ?? ""} onChange={(e) => field("font-weight", e.target.value)}
                    className="w-full px-2 py-2 rounded-xl border border-slate-300 text-xs">
                    {["", "300", "400", "500", "600", "700", "800", "900"].map((w) => (
                      <option key={w} value={w}>{w || "ظ¾غŒط´â€Œظپط±ط¶"}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="ط±ظ†ع¯ ظ…طھظ†">
                <input type="color" value={draft.color || "#000000"} onChange={(e) => field("color", e.target.value)}
                  className="w-full h-10 rounded-xl border border-slate-300" />
              </Field>

              {/* Hover / touch colors â€” works for menu items and their sub-items */}
              <div className="rounded-xl border border-slate-200 p-2.5 space-y-2">
                <Field label="ظ‡ط§ظˆط± ظˆ ظ„ظ…ط³ (ط¯ط³ع©طھط§ظ¾ ظˆ ظ…ظˆط¨ط§غŒظ„)">
                  <select value={draft["hover-on"] ?? ""} onChange={(e) => field("hover-on", e.target.value)}
                    className="w-full px-2 py-2 rounded-xl border border-slate-300 text-xs">
                    <option value="">ط¨ط¯ظˆظ† طھط؛غŒغŒط±</option>
                    <option value="1">ظپط¹ط§ظ„ ع©ط±ط¯ظ† ط±ظ†ع¯ ظ‡ط§ظˆط±</option>
                    <option value="0">ط­ط°ظپ ط±ظ†ع¯ ظ‡ط§ظˆط±</option>
                  </select>
                </Field>
                {draft["hover-on"] === "1" && (
                  <>
                    <Field label="ط±ظ†ع¯ ظ…طھظ† ط¯ط± ظ‡ط§ظˆط±">
                      <input type="color" value={draft["hover-color"] || "#0b1e3f"}
                        onChange={(e) => field("hover-color", e.target.value)}
                        className="w-full h-10 rounded-xl border border-slate-300" />
                    </Field>
                    <Field label="ظ¾ط³â€Œط²ظ…غŒظ†ظ‡ ط¯ط± ظ‡ط§ظˆط±">
                      <select value={draft["hover-bg-mode"] ?? "keep"} onChange={(e) => field("hover-bg-mode", e.target.value)}
                        className="w-full px-2 py-2 rounded-xl border border-slate-300 text-xs">
                        <option value="keep">ط¨ط¯ظˆظ† طھط؛غŒغŒط±</option>
                        <option value="transparent">ع©ط§ظ…ظ„ط§ظ‹ ط´ظپط§ظپ</option>
                        <option value="custom">ط±ظ†ع¯غŒ ط¨ط§ ع©ظ†طھط±ظ„ ط´ظپط§ظپغŒطھ</option>
                      </select>
                    </Field>
                    {draft["hover-bg-mode"] === "custom" && (
                      <>
                        <Field label="ط±ظ†ع¯ ظ¾ط³â€Œط²ظ…غŒظ†ظ‡ ظ‡ط§ظˆط±">
                          <input type="color" value={draft["hover-bg"] || "#ffffff"}
                            onChange={(e) => field("hover-bg", e.target.value)}
                            className="w-full h-10 rounded-xl border border-slate-300" />
                        </Field>
                        <Field label={`ط´ظپط§ظپغŒطھ ظ¾ط³â€Œط²ظ…غŒظ†ظ‡ ظ‡ط§ظˆط±: ${draft["hover-bg-alpha"] ?? "100"}%`}>
                          <input type="range" min={0} max={100} step={1}
                            value={Number(draft["hover-bg-alpha"] ?? "100")}
                            onChange={(e) => field("hover-bg-alpha", e.target.value)}
                            className="w-full" />
                        </Field>
                      </>
                    )}
                    <Field label="ط±ظ†ع¯ ط­ط§ط´غŒظ‡ ط¯ط± ظ‡ط§ظˆط±">
                      <input type="color" value={draft["hover-border"] || "#0b1e3f"}
                        onChange={(e) => field("hover-border", e.target.value)}
                        className="w-full h-10 rounded-xl border border-slate-300" />
                    </Field>
                    <label className="flex items-center gap-2 text-xs text-slate-600">
                      <input type="checkbox" checked={draft["hover-underline"] === "1"}
                        onChange={(e) => field("hover-underline", e.target.checked ? "1" : "")} />
                      ط²غŒط±ط®ط·â€Œط¯ط§ط± ط´ط¯ظ† ط¯ط± ظ‡ط§ظˆط±
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-600">
                      <input type="checkbox" checked={draft["hover-deep"] === "1"}
                        onChange={(e) => field("hover-deep", e.target.checked ? "1" : "")} />
                      ط§ط¹ظ…ط§ظ„ ط±ظˆغŒ ط¢غŒع©ظ†â€Œظ‡ط§ ظˆ ط²غŒط± ط¢غŒطھظ…â€Œظ‡ط§غŒ ط¯ط§ط®ظ„ ط§غŒظ† ط¹ظ†طµط±
                    </label>
                    <p className="text-[11px] text-slate-500 leading-5">
                      ط±ظˆغŒ ط¢غŒطھظ… ظپظ‡ط±ط³طھ غŒط§ ط²غŒط±ط¢غŒطھظ… ع©ظ„غŒع© ع©ظ†غŒط¯ ظˆ ط±ظ†ع¯ ط¯ظ„ط®ظˆط§ظ‡ ظ‡ط§ظˆط± ط±ط§ ط§ظ†طھط®ط§ط¨ ع©ظ†غŒط¯ط› ط¯ط± ظ…ظˆط¨ط§غŒظ„ ظ‡ظ†ع¯ط§ظ… ظ„ظ…ط³ ظ‡ظ…ط§ظ† ط±ظ†ع¯ ظ†ظ…ط§غŒط´ ط¯ط§ط¯ظ‡ ظ…غŒâ€Œط´ظˆط¯.
                    </p>
                  </>
                )}
              </div>



              <div className="rounded-xl border border-slate-200 p-2.5 space-y-2">
                <Field label="ظ¾ط³â€Œط²ظ…غŒظ†ظ‡">
                  <select value={draft["bg-mode"] ?? "keep"} onChange={(e) => field("bg-mode", e.target.value)}
                    className="w-full px-2 py-2 rounded-xl border border-slate-300 text-xs">
                    <option value="keep">ط¨ط¯ظˆظ† طھط؛غŒغŒط±</option>
                    <option value="transparent">ع©ط§ظ…ظ„ط§ظ‹ ط´ظپط§ظپ</option>
                    <option value="custom">ط±ظ†ع¯غŒ ط¨ط§ ع©ظ†طھط±ظ„ ط´ظپط§ظپغŒطھ</option>
                  </select>
                </Field>
                {(draft["bg-mode"] ?? "keep") === "custom" && (
                  <>
                    <Field label="ط±ظ†ع¯ ظ¾ط³â€Œط²ظ…غŒظ†ظ‡">
                      <input type="color" value={draft["background-color"] || "#ffffff"}
                        onChange={(e) => field("background-color", e.target.value)}
                        className="w-full h-10 rounded-xl border border-slate-300" />
                    </Field>
                    <Field label={`ظ…غŒط²ط§ظ† ط´ظپط§ظپغŒطھ: ${draft["bg-alpha"] ?? "100"}%`}>
                      <input type="range" min={0} max={100} step={1}
                        value={Number(draft["bg-alpha"] ?? "100")}
                        onChange={(e) => field("bg-alpha", e.target.value)}
                        className="w-full" />
                    </Field>
                  </>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 p-2.5 space-y-2">
                <Field label="ط§ظ†غŒظ…غŒط´ظ† ط¹ظ†طµط±">
                  <select value={draft["anim-name"] ?? ""} onChange={(e) => field("anim-name", e.target.value)}
                    className="w-full px-2 py-2 rounded-xl border border-slate-300 text-xs">
                    {VE_ANIMATIONS.map((a) => <option key={a.v} value={a.v}>{a.label}</option>)}
                  </select>
                </Field>
                {draft["anim-name"] && (
                  <div className="grid grid-cols-3 gap-2">
                    <Field label="ظ…ط¯طھ (ms)">
                      <input dir="ltr" value={draft["anim-duration"] ?? "700"} onChange={(e) => field("anim-duration", e.target.value)}
                        className="w-full px-2 py-2 rounded-xl border border-slate-300 text-xs" />
                    </Field>
                    <Field label="طھط£ط®غŒط± (ms)">
                      <input dir="ltr" value={draft["anim-delay"] ?? "0"} onChange={(e) => field("anim-delay", e.target.value)}
                        className="w-full px-2 py-2 rounded-xl border border-slate-300 text-xs" />
                    </Field>
                    <Field label="طھع©ط±ط§ط±">
                      <select value={draft["anim-iteration"] ?? "1"} onChange={(e) => field("anim-iteration", e.target.value)}
                        className="w-full px-1 py-2 rounded-xl border border-slate-300 text-xs">
                        <option value="1">غ± ط¨ط§ط±</option>
                        <option value="2">غ² ط¨ط§ط±</option>
                        <option value="3">غ³ ط¨ط§ط±</option>
                        <option value="infinite">ط¨غŒâ€Œظ†ظ‡ط§غŒطھ</option>
                      </select>
                    </Field>
                  </div>
                )}
              </div>

              <Field label="ع†غŒظ†ط´ ظ…طھظ†">
                <select value={draft["text-align"] ?? ""} onChange={(e) => field("text-align", e.target.value)}
                  className="w-full px-2 py-2 rounded-xl border border-slate-300 text-xs">
                  {["", "right", "center", "left", "justify"].map((a) => (
                    <option key={a} value={a}>{a || "ظ¾غŒط´â€Œظپط±ط¶"}</option>
                  ))}
                </select>
              </Field>


              {/* Insert a new block / section right after this element */}
              <div className="rounded-xl border border-slate-200 p-2.5 space-y-2">
                <Field label="ط§ظپط²ظˆط¯ظ† ط¨ظ„ظˆع© غŒط§ ط³ع©ط´ظ† ط¬ط¯غŒط¯ (ط¨ط¹ط¯ ط§ط² ط§غŒظ† ط¹ظ†طµط±)">
                  <select
                    value=""
                    onChange={(e) => {
                      const t = BLOCK_TEMPLATES.find((b) => b.key === e.target.value);
                      if (t) field("block", t.html);
                    }}
                    className="w-full px-2 py-2 rounded-xl border border-slate-300 text-xs"
                  >
                    <option value="">غŒع© ظ‚ط§ظ„ط¨ ط¢ظ…ط§ط¯ظ‡ ط§ظ†طھط®ط§ط¨ ع©ظ†غŒط¯â€¦</option>
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
                  placeholder="<section>â€¦</section>"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => send({ type: "ve:update", selector: sel.selector, patch: { block: draft.block ?? "" } })}
                    className="flex-1 text-xs font-bold bg-emerald-600 text-white rounded-xl py-2"
                  >
                    ط§ظپط²ظˆط¯ظ† / ط¨ظ‡â€Œط±ظˆط²ط±ط³ط§ظ†غŒ ط¨ظ„ظˆع©
                  </button>
                  <button
                    onClick={() => { field("block", ""); send({ type: "ve:update", selector: sel.selector, patch: { block: "" } }); }}
                    className="px-3 text-xs rounded-xl border border-slate-300"
                  >
                    ط­ط°ظپ ط¨ظ„ظˆع©
                  </button>
                </div>
              </div>


              <div className="flex gap-2 pt-1">
                <button onClick={apply}
                  className="flex-1 bg-[#0b1e3f] hover:bg-[#122b57] text-white text-sm font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5">
                  <Save className="w-4 h-4" /> ط§ط¹ظ…ط§ظ„
                </button>
                <button onClick={() => send({ type: "ve:reset", selector: sel.selector })}
                  className="px-3 rounded-xl border border-slate-300 text-xs">ط­ط°ظپ طھط؛غŒغŒط±</button>
              </div>
              <button
                onClick={() => send({ type: "ve:update", selector: sel.selector, patch: { hidden: true } })}
                className="w-full text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl py-2"
              >
                ط­ط°ظپ / ظ¾ظ†ظ‡ط§ظ†â€Œط³ط§ط²غŒ ط§غŒظ† ط¨ط®ط´
              </button>
              {saved && <div className="text-[11px] text-emerald-600">ط°ط®غŒط±ظ‡ ط´ط¯.</div>}
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


/* ---------- Overview ---------- */
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
    { label: "ط¯ط±ط®ظˆط§ط³طھâ€Œظ‡ط§غŒ ظ…ط´ط§ظˆط±ظ‡", value: cCount, icon: MessageSquare, color: "from-blue-500 to-indigo-600" },
    { label: "ع¯ط²ط§ط±ط´â€Œظ‡ط§غŒ ط®ط³ط§ط±طھ", value: dCount, icon: AlertTriangle, color: "from-amber-500 to-orange-600" },
    { label: "ط¢غŒطھظ…â€Œظ‡ط§غŒ ظ…ظ†ظˆ", value: mCount, icon: MenuIcon, color: "from-emerald-500 to-teal-600" },
  ];
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#0b1e3f] mb-2">ط®ظˆط´ ط¢ظ…ط¯غŒط¯ ًں‘‹</h1>
      <p className="text-sm text-slate-500 mb-8">ط®ظ„ط§طµظ‡â€Œط§غŒ ط§ط² ظ…ط­طھظˆط§غŒ ظˆط¨â€Œط³ط§غŒطھ ط´ظ…ط§.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 hover:shadow-xl transition">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.color} grid place-items-center text-white mb-4`}>
              <c.icon className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-[#0b1e3f]">{c.value ?? "â€”"}</div>
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
    if (!confirm("ط­ط°ظپ ط´ظˆط¯طں")) return;
    await adminDb("contact_messages").delete().eq("id", id);
    load();
  };
  return (
    <PaneShell title="ط¯ط±ط®ظˆط§ط³طھâ€Œظ‡ط§غŒ ظ…ط´ط§ظˆط±ظ‡" onRefresh={load}>
      {loading ? <Empty text="ط¯ط± ط­ط§ظ„ ط¨ط§ط±ع¯ط°ط§ط±غŒ..." /> : rows.length === 0 ? <Empty text="ظ…ظˆط±ط¯غŒ ط«ط¨طھ ظ†ط´ط¯ظ‡." /> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <Th>ظ†ط§ظ…</Th><Th>طھظ„ظپظ†</Th><Th>ط§غŒظ…غŒظ„</Th><Th>ط§ط³طھط§ظ†</Th><Th>ظ†ظˆط¹ ط¨غŒظ…ظ‡</Th><Th>طھط§ط±غŒط®</Th><Th></Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                  <Td>{r.full_name}</Td>
                  <Td dir="ltr">{r.phone}</Td>
                  <Td>{r.email || "â€”"}</Td>
                  <Td>{r.province || "â€”"}</Td>
                  <Td>{r.insurance_type || "â€”"}</Td>
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
    if (!confirm("ط­ط°ظپ ط´ظˆط¯طں")) return;
    await adminDb("damage_reports").delete().eq("id", id);
    load();
  };
  return (
    <PaneShell title="ع¯ط²ط§ط±ط´â€Œظ‡ط§غŒ ط®ط³ط§ط±طھ" onRefresh={load}>
      {loading ? <Empty text="ط¯ط± ط­ط§ظ„ ط¨ط§ط±ع¯ط°ط§ط±غŒ..." /> : rows.length === 0 ? <Empty text="ظ…ظˆط±ط¯غŒ ط«ط¨طھ ظ†ط´ط¯ظ‡." /> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <Th>ظ†ط§ظ…</Th><Th>طھظ„ظپظ†</Th><Th>ط´ظ…ط§ط±ظ‡ ط¨غŒظ…ظ‡â€Œظ†ط§ظ…ظ‡</Th><Th>طھط§ط±غŒط® ط­ط§ط¯ط«ظ‡</Th><Th>ظˆط¶ط¹غŒطھ</Th><Th>ط«ط¨طھ</Th><Th></Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                  <Td>{r.full_name}</Td>
                  <Td dir="ltr">{r.phone}</Td>
                  <Td>{r.policy_number || "â€”"}</Td>
                  <Td>{r.accident_date || "â€”"}</Td>
                  <Td>
                    <select value={r.status} onChange={(e) => setStatus(r.id, e.target.value)}
                      className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1">
                      <option value="new">ط¬ط¯غŒط¯</option>
                      <option value="in_progress">ط¯ط± ط­ط§ظ„ ط±ط³غŒط¯ع¯غŒ</option>
                      <option value="done">ط±ط³غŒط¯ع¯غŒ ط´ط¯ظ‡</option>
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
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  const load = async () => {
    setLoading(true);
    const { data } = await adminDb("site_menu_items").select("*").order("position", { ascending: true });
    setItems((data as MenuItem[]) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const shown = useMemo(() =>
    items.filter((i) => i.device === "both" || i.device === device),
    [items, device]);

  const roots = shown.filter((i) => !i.parent_id);
  const childrenOf = (id: string) => shown.filter((i) => i.parent_id === id);

  const add = async (parent_id: string | null) => {
    const label = prompt("ط¹ظ†ظˆط§ظ† ط¢غŒطھظ… ظ…ظ†ظˆ:");
    if (!label) return;
    const href = prompt("ظ„غŒظ†ع© (ط§ط®طھغŒط§ط±غŒ):") || null;
    const siblings = items.filter((i) => i.parent_id === parent_id);
    await adminDb("site_menu_items").insert({
      label, href, parent_id, position: siblings.length,
      device: parent_id ? "both" : device, is_active: true,
    } as any);
    load();
  };
  const update = async (id: string, patch: Partial<MenuItem>) => {
    await adminDb("site_menu_items").update(patch as any).eq("id", id);
    load();
  };
  const del = async (id: string) => {
    if (!confirm("ط§غŒظ† ط¢غŒطھظ… ظˆ ظ‡ظ…ظ‡ ط²غŒط±ط¢غŒطھظ…â€Œظ‡ط§غŒط´ ط­ط°ظپ ط´ظˆط¯طں")) return;
    await adminDb("site_menu_items").delete().eq("id", id);
    load();
  };

  /** Fills the table with the menu currently shown on the site, so it can be edited. */
  const importCurrent = async () => {
    if (items.length && !confirm("ظ…ظ†ظˆغŒ ظپط¹ظ„غŒ ط³ط§غŒطھ ط¨ظ‡ ظپظ‡ط±ط³طھ ط§ط¶ط§ظپظ‡ ط´ظˆط¯طں")) return;
    const rows: Record<string, unknown>[] = [];
    const walk = (list: NavItem[], parent_id: string | null) => {
      list.forEach((n, i) => {
        const id = crypto.randomUUID();
        rows.push({
          id,
          parent_id,
          label: n.label,
          href: n.href ?? null,
          position: i,
          device: "both",
          is_active: true,
        });
        if (n.children?.length) walk(n.children, id);
      });
    };
    walk(navItems, null);
    await adminDb("site_menu_items").insert(rows);
    load();
  };

  return (
    <PaneShell title="ظ…ط¯غŒط±غŒطھ ط¢غŒطھظ…â€Œظ‡ط§غŒ ظ…ظ†ظˆ" onRefresh={load}
      extra={
        <div className="flex items-center gap-2">
          <DeviceToggle value={device} onChange={setDevice} />
          <button onClick={importCurrent}
            className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 bg-white">
            ط¯ط±ظˆظ†â€Œط±غŒط²غŒ ظ…ظ†ظˆغŒ ظپط¹ظ„غŒ ط³ط§غŒطھ
          </button>
          <button onClick={() => add(null)}
            className="flex items-center gap-1.5 bg-[#0b1e3f] hover:bg-[#122b57] text-white text-xs font-bold px-3 py-2 rounded-xl transition">
            <Plus className="w-4 h-4" /> ط§ظپط²ظˆط¯ظ† ط¢غŒطھظ… ط§طµظ„غŒ
          </button>
        </div>
      }
    >
      {loading ? <Empty text="ط¯ط± ط­ط§ظ„ ط¨ط§ط±ع¯ط°ط§ط±غŒ..." /> : roots.length === 0 ? (
        <Empty text="ظ‡ظ†ظˆط² ط¢غŒطھظ…غŒ ط¨ط±ط§غŒ ط§غŒظ† ظ†ظ…ط§ طھط¹ط±غŒظپ ظ†ط´ط¯ظ‡ â€” ط¨ط§ آ«ط§ظپط²ظˆط¯ظ† ط¢غŒطھظ… ط§طµظ„غŒآ» ط´ط±ظˆط¹ ع©ظ†غŒط¯." />
      ) : (
        <ul className="space-y-2">
          {roots.map((r) => (
            <MenuRow key={r.id} item={r} depth={0} onUpdate={update} onDelete={del} onAddChild={add} childrenOf={childrenOf} />
          ))}
        </ul>
      )}
    </PaneShell>
  );
}

function MenuRow({
  item, depth, onUpdate, onDelete, onAddChild, childrenOf,
}: {
  item: MenuItem; depth: number;
  onUpdate: (id: string, patch: Partial<MenuItem>) => void;
  onDelete: (id: string) => void;
  onAddChild: (parent_id: string) => void;
  childrenOf: (id: string) => MenuItem[];
}) {
  const [label, setLabel] = useState(item.label);
  const [href, setHref] = useState(item.href || "");
  const kids = childrenOf(item.id);
  const dirty = label !== item.label || (href || "") !== (item.href || "");

  return (
    <li>
      <div style={{ paddingRight: depth * 12 }}>
        <div className="flex flex-wrap items-center gap-2 bg-white rounded-xl border border-slate-200 p-2.5 hover:border-[#0b1e3f]/40 transition">
          <span className="w-6 h-6 rounded-md bg-slate-100 grid place-items-center text-[10px] font-bold text-slate-500">{item.position + 1}</span>
          <input value={label} onChange={(e) => setLabel(e.target.value)}
            className="flex-1 min-w-[130px] px-2 py-1.5 text-sm rounded-lg border border-slate-200 focus:border-[#0b1e3f] outline-none" />
          <input value={href} onChange={(e) => setHref(e.target.value)} placeholder="/link" dir="ltr"
            className="w-full sm:w-40 px-2 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-[#0b1e3f] outline-none" />
          <select value={item.device} onChange={(e) => onUpdate(item.id, { device: e.target.value as any })}
            className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1.5">
            <option value="both">ظ‡ط± ط¯ظˆ</option>
            <option value="desktop">ط¯ط³ع©طھط§ظ¾</option>
            <option value="mobile">ظ…ظˆط¨ط§غŒظ„</option>
          </select>
          <label className="flex items-center gap-1 text-xs text-slate-600">
            <input type="checkbox" checked={item.is_active} onChange={(e) => onUpdate(item.id, { is_active: e.target.checked })} />
            ظپط¹ط§ظ„
          </label>
          {dirty && (
            <IconBtn tone="primary" onClick={() => onUpdate(item.id, { label, href: href || null })}>
              <Save className="w-4 h-4" />
            </IconBtn>
          )}
          <IconBtn onClick={() => onAddChild(item.id)}><Plus className="w-4 h-4" /></IconBtn>
          <IconBtn tone="danger" onClick={() => onDelete(item.id)}><Trash2 className="w-4 h-4" /></IconBtn>
        </div>
      </div>
      {kids.length > 0 && (
        <ul className="mt-2 space-y-2">
          {kids.map((k) => (
            <MenuRow key={k.id} item={k} depth={depth + 1}
              onUpdate={onUpdate} onDelete={onDelete} onAddChild={onAddChild} childrenOf={childrenOf} />
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
    const title = prompt("ط¹ظ†ظˆط§ظ† ط³طھظˆظ† ظپظˆطھط±:");
    if (!title) return;
    await adminDb("site_footer_sections").insert({ title, position: sections.length, is_active: true } as any);
    load();
  };
  const updateSection = async (id: string, patch: Partial<FooterSection>) => {
    await adminDb("site_footer_sections").update(patch as any).eq("id", id); load();
  };
  const delSection = async (id: string) => {
    if (!confirm("ط§غŒظ† ط³طھظˆظ† ظˆ ظ‡ظ…ظ‡ ظ„غŒظ†ع©â€Œظ‡ط§غŒط´ ط­ط°ظپ ط´ظˆط¯طں")) return;
    await adminDb("site_footer_sections").delete().eq("id", id); load();
  };
  const addLink = async (section_id: string) => {
    const label = prompt("ط¹ظ†ظˆط§ظ† ظ„غŒظ†ع©:"); if (!label) return;
    const href = prompt("ط¢ط¯ط±ط³ ظ„غŒظ†ع©:") || "#";
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
    <PaneShell title="ظ…ط¯غŒط±غŒطھ ظپظˆطھط±" onRefresh={load}
      extra={
        <button onClick={addSection}
          className="flex items-center gap-1.5 bg-[#0b1e3f] hover:bg-[#122b57] text-white text-xs font-bold px-3 py-2 rounded-xl transition">
          <Plus className="w-4 h-4" /> ط³طھظˆظ† ط¬ط¯غŒط¯
        </button>
      }
    >
      {loading ? <Empty text="ط¯ط± ط­ط§ظ„ ط¨ط§ط±ع¯ط°ط§ط±غŒ..." /> : sections.length === 0 ? (
        <Empty text="ظ‡ظ†ظˆط² ط³طھظˆظ†غŒ طھط¹ط±غŒظپ ظ†ط´ط¯ظ‡ â€” ط¨ط§ آ«ط³طھظˆظ† ط¬ط¯غŒط¯آ» ط´ط±ظˆط¹ ع©ظ†غŒط¯." />
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
                  <li className="text-xs text-slate-400 text-center py-2">ظ‡ظ†ظˆط² ظ„غŒظ†ع©غŒ ط§ط¶ط§ظپظ‡ ظ†ط´ط¯ظ‡.</li>
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
              <RefreshCw className="w-3.5 h-3.5" /> ط¨ظ‡â€Œط±ظˆط²ط±ط³ط§ظ†غŒ
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

function DeviceToggle({ value, onChange }: { value: "desktop" | "mobile"; onChange: (v: "desktop" | "mobile") => void }) {
  return (
    <div className="inline-flex bg-slate-100 rounded-xl p-1 text-xs font-bold">
      <button onClick={() => onChange("desktop")}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition ${value === "desktop" ? "bg-white text-[#0b1e3f] shadow" : "text-slate-500"}`}>
        <Monitor className="w-3.5 h-3.5" /> ط¯ط³ع©طھط§ظ¾
      </button>
      <button onClick={() => onChange("mobile")}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition ${value === "mobile" ? "bg-white text-[#0b1e3f] shadow" : "text-slate-500"}`}>
        <Smartphone className="w-3.5 h-3.5" /> ظ…ظˆط¨ط§غŒظ„
      </button>
    </div>
  );
}

function IconBtn({ children, onClick, tone = "default" }: {
  children: React.ReactNode; onClick?: () => void; tone?: "default" | "danger" | "primary";
}) {
  const toneCls =
    tone === "danger" ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
    : tone === "primary" ? "bg-[#0b1e3f] text-white hover:bg-[#122b57]"
    : "bg-slate-100 text-slate-600 hover:bg-slate-200";
  return (
    <button type="button" onClick={onClick}
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


