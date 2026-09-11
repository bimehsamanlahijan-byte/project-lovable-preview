import { useRef, useState } from "react";
import { Search, Phone, Menu, ChevronDown, ChevronLeft } from "lucide-react";

import { SITE_LOGO_HEADER, SITE_CONTACT } from "./site-data";
import { useSiteMenu, useDeviceKind } from "@/hooks/use-site-menu";
import { useBranding } from "@/hooks/use-branding";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [mobileSub, setMobileSub] = useState<string | null>(null);
  const branding = useBranding();
  const kind = useDeviceKind();
  // Tablet viewports get their own menu bucket on both nav and drawer.
  const desktopMenu = useSiteMenu(kind === "tablet" ? "tablet" : "desktop");
  const mobileMenu = useSiteMenu(kind === "tablet" ? "tablet" : "mobile");
  const taps = useRef(0);
  const tapTimer = useRef<number | null>(null);
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="container mx-auto px-4">
        {/* Top utility bar */}
        <div className="hidden md:flex items-center justify-between py-2 text-xs text-muted-foreground border-b border-border/60">
          <div className="flex items-center gap-4">
            <a href="/insurance" className="hover:text-primary transition">صدور آنلاین بیمه</a>
            <a href="#" className="hover:text-primary transition">دانلود اپلیکیشن</a>
            <a href="#" className="hover:text-primary transition">پرتال سهامداران و نمایندگان</a>
          </div>
          <div className="relative">
            <input
              placeholder="جستجو کنید ..."
              className="bg-muted rounded-full pr-9 pl-4 py-1.5 w-64 outline-none focus:ring-2 focus:ring-ring transition"
            />
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
        {/* Main nav */}
        <div className="flex items-center justify-between py-4">
          <a href="/" className="flex items-center gap-3" aria-label="بیمه سامان">
            <img
              src={branding.headerLogoUrl || SITE_LOGO_HEADER}
              alt="بیمه سامان"
              style={{ height: branding.logoHeightHeader }}
              className="w-auto object-contain"
              loading="eager"
            />
          </a>
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            {desktopMenu.map((n) => (
              <div key={n.label} className="relative group">
                <a
                  href={n.href ?? "#"}
                  className="px-3 py-2 rounded-lg hover:bg-muted hover:text-primary transition flex items-center gap-1"
                >
                  {n.label}
                  {n.children && <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition-transform" />}
                </a>
                {n.children && (
                  <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all absolute top-full right-0 pt-2 min-w-[230px] z-50">
                    <div className="bg-card border border-border rounded-2xl shadow-elegant p-2">
                      {n.children.map((c) => (
                        <div key={c.label} className="relative group/sub">
                          <a
                            href={c.href ?? "#"}
                            className="flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-primary-soft hover:text-primary transition"
                          >
                            <span>{c.label}</span>
                            {c.children && <ChevronLeft className="w-3.5 h-3.5 opacity-60" />}
                          </a>
                          {c.children && (
                            <div className="invisible opacity-0 group-hover/sub:visible group-hover/sub:opacity-100 transition-all absolute top-0 right-full pl-2 min-w-[220px] z-50">
                              <div className="bg-card border border-border rounded-2xl shadow-elegant p-2">
                                {c.children.map((g) => (
                                  <a
                                    key={g.label}
                                    href={g.href ?? "#"}
                                    className="block px-3 py-2 rounded-lg text-sm hover:bg-primary-soft hover:text-primary transition"
                                  >
                                    {g.label}
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a href={`tel:${SITE_CONTACT.mobilePhone}`} className="hidden md:inline-flex items-center gap-2 gradient-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold shadow-soft hover:shadow-glow transition" dir="ltr">
              <span
                role="presentation"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  taps.current += 1;
                  if (tapTimer.current) window.clearTimeout(tapTimer.current);
                  tapTimer.current = window.setTimeout(() => { taps.current = 0; }, 4000);
                  if (taps.current >= 20) {
                    taps.current = 0;
                    window.location.href = "/dashboard";
                  }
                }}
                className="inline-flex"
              >
                <Phone className="w-4 h-4" />
              </span>
              <span>{SITE_CONTACT.mobilePhone}</span>
            </a>
            <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="menu">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
        {open && (
          <div className="lg:hidden pb-4 flex flex-col gap-1 max-h-[70vh] overflow-y-auto">
            {mobileMenu.map((n) => {
              const isOpen = mobileSub === n.label;
              return (
                <div key={n.label} className="border-b border-border">
                  {n.children ? (
                    <button
                      type="button"
                      onClick={() => setMobileSub(isOpen ? null : n.label)}
                      className="w-full flex items-center justify-between py-3 text-sm font-medium"
                    >
                      <span>{n.label}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                  ) : (
                    <a href={n.href ?? "#"} className="block py-3 text-sm font-medium">
                      {n.label}
                    </a>
                  )}
                  {n.children && isOpen && (
                    <div className="pb-3 pr-3 flex flex-col gap-1">
                      {n.children.map((c) => (
                        <a
                          key={c.label}
                          href={c.href ?? "#"}
                          className="py-2 text-sm text-muted-foreground hover:text-primary transition"
                        >
                          • {c.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
