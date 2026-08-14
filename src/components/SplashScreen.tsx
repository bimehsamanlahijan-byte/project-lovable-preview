import { useEffect, useState } from "react";

import { DEFAULT_SPLASH, readSetting, type SplashSettings } from "@/lib/site-config";

const SESSION_KEY = "site_splash_shown";

/**
 * Cloudflare-style loading screen: shows the brand logo on a solid background
 * before the site is revealed. Fully configurable from the dashboard
 * (لوگو، آیکن‌ها و عنوان → صفحه بارگذاری).
 */
export function SplashScreen() {
  const [cfg, setCfg] = useState<SplashSettings | null>(null);
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [mounted] = useState(() => Date.now());

  useEffect(() => {
    // Never cover the dashboard or the visual editor iframe.
    const path = window.location.pathname;
    if (path.startsWith("/dashboard") || window.location.search.includes("ve=1") || window.location.search.includes("inspect=1")) {
      setVisible(false);
      return;
    }
    let alive = true;
    void readSetting<SplashSettings>("splash", DEFAULT_SPLASH)
      .then((v) => {
        if (alive) setCfg(v);
      })
      .catch(() => {
        if (alive) setCfg(DEFAULT_SPLASH);
      });
    // Failsafe: never let the overlay block the site if settings never arrive.
    const failsafe = window.setTimeout(() => {
      if (alive) setCfg((c) => c ?? DEFAULT_SPLASH);
    }, 2500);
    return () => {
      alive = false;
      window.clearTimeout(failsafe);
    };
  }, []);

  useEffect(() => {
    if (!cfg) return;
    const elapsed = Date.now() - mounted;
    const seen = cfg.oncePerSession && window.sessionStorage.getItem(SESSION_KEY) === "1";
    if (!cfg.enabled || seen) {
      setVisible(false);
      return;
    }
    const hide = window.setTimeout(() => {
      setFading(true);
      window.setTimeout(() => {
        setVisible(false);
        try {
          window.sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
          /* ignore */
        }
      }, 400);
    }, Math.max(0, Math.max(300, cfg.minMs) - elapsed));
    return () => window.clearTimeout(hide);
  }, [cfg]);

  // Render immediately with defaults so the logo is on screen before the
  // dashboard settings arrive; the config only decides when it disappears.
  const view = cfg ?? DEFAULT_SPLASH;
  if (!visible || (cfg && !cfg.enabled)) return null;

  return (
    <div
      aria-hidden
      style={{ background: view.bgColor, opacity: fading ? 0 : 1 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-400"
    >
      {view.logoCode ? (
        <div dangerouslySetInnerHTML={{ __html: view.logoCode }} />
      ) : view.logoUrl ? (
        <img src={view.logoUrl} alt="" style={{ height: view.logoHeight }} className="w-auto object-contain" />
      ) : null}

      {view.text && (
        <div className="mt-4 text-sm font-bold" style={{ color: view.textColor }}>
          {view.text}
        </div>
      )}

      {view.showBar && (
        <div className="mt-6 h-1 w-32 overflow-hidden rounded-full" style={{ background: `${view.barColor}22` }}>
          <div className="h-full w-1/3 animate-[splashbar_1.1s_ease-in-out_infinite] rounded-full" style={{ background: view.barColor }} />
        </div>
      )}

      <style>{`@keyframes splashbar{0%{transform:translateX(-120%)}100%{transform:translateX(320%)}}`}</style>
    </div>
  );
}
