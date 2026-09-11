import { AnimatePresence, motion } from "framer-motion";
import { Link, useRouterState } from "@tanstack/react-router";
import { CityscapeBackdrop } from "./CityscapeBackdrop";
import { WheelBackground } from "./WheelBackground";
import { SITE_CONTACT } from "./site-data";
import { AnnouncementTicker } from "./AnnouncementTicker";
import { BrandCartBadge } from "./BrandCartBadge";
import { useSiteSetting } from "@/hooks/use-site-setting";
import { useDeviceKind } from "@/hooks/use-device-kind";
import { DEFAULT_WHEEL_INTRO, type WheelIntroSettings } from "@/lib/site-config";
import { ShoppingCart, Sparkles, X } from "lucide-react";


import {
  Car,
  Shield,
  Heart,
  Home as HomeIcon,
  Stethoscope,
  Plane,
  Truck,
  ShieldAlert,
  Briefcase,
  HardHat,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const announcements = [
  "بیمه درمان خانواده: «بیمه درمان خانواده سامان، افزایش اطمینان از سلامتی و آرامش خود و خانواده‌مان است.»",
  "بیمه سامان؛ حامی سلامت خانواده و جامعه",
  "با بیمه تکمیلی سامان، نگران هزینه‌های درمان نباشید!",
  "با بیمه عمر سامان، بازنشستگی باکیفیت‌تری بسازید",
  "با بیمه مسافرتی سامان، با خیال راحت سفر کن ✈️",
  "تخفیف ۲۰ درصد بیمه بدنه در صدور بیمه شخص ثالث سامان",
  `بیمه سامان لاهیجان کد 8452 آذرخش - آدرس: لاهیجان-خیابان ام خمینی-روبروی بانک توسعه و تعاون ساختمان اداری پارادایس - تلفن: ${SITE_CONTACT.landlinePhone} - همراه: ${SITE_CONTACT.mobilePhone}`,
];

type Item = { title: string; icon: LucideIcon; href: string };

const items: Item[] = [
  { title: "بیمه شخص ثالث", icon: Car, href: "/insurance/car/third-party" },
  { title: "بیمه بدنه", icon: Shield, href: "/insurance/car/body" },
  { title: "بیمه عمر و سرمایه‌گذاری", icon: Heart, href: "/insurance/life/investment" },
  { title: "بیمه آتش‌سوزی منازل", icon: HomeIcon, href: "/insurance/fire/residential" },
  { title: "بیمه درمان تکمیلی", icon: Stethoscope, href: "/insurance/health/private-health" },
  { title: "بیمه مسافرتی", icon: Plane, href: "/insurance/travel" },
  { title: "بیمه باربری", icon: Truck, href: "/insurance/cargo" },
  { title: "بیمه حوادث انفرادی", icon: ShieldAlert, href: "/insurance/life/accident/individual-personal-accident" },
  { title: "بیمه مسئولیت", icon: Briefcase, href: "/insurance/liability" },
  { title: "بیمه مهندسی", icon: HardHat, href: "/insurance/engineering" },
  { title: "موبایل و تجهیزات الکترونیک", icon: Smartphone, href: "/insurance/e-e" },
];

const REVEAL_VARIANTS: Record<string, { initial: Record<string, number>; animate: Record<string, number> }> = {
  explode: { initial: { scale: 0.1, rotate: -220, opacity: 0 }, animate: { scale: 1, rotate: 0, opacity: 1 } },
  zoom: { initial: { scale: 0.5, opacity: 0 }, animate: { scale: 1, opacity: 1 } },
  spin: { initial: { rotate: -540, opacity: 0 }, animate: { rotate: 0, opacity: 1 } },
  flip: { initial: { rotateY: 90, opacity: 0 }, animate: { rotateY: 0, opacity: 1 } },
  fade: { initial: { opacity: 0 }, animate: { opacity: 1 } },
};

function WheelSection() {
  const intro = useSiteSetting<WheelIntroSettings>("wheel_intro", DEFAULT_WHEEL_INTRO);
  const kind = useDeviceKind();
  /* Needle length + center-text offset are tuned per breakpoint from the dashboard. */
  const needleLen =
    kind === "mobile"
      ? (intro.needleLenMobile ?? DEFAULT_WHEEL_INTRO.needleLenMobile)
      : kind === "tablet"
        ? (intro.needleLenTablet ?? DEFAULT_WHEEL_INTRO.needleLenTablet)
        : (intro.needleLenDesktop ?? DEFAULT_WHEEL_INTRO.needleLenDesktop);
  const centerTextX =
    kind === "mobile"
      ? (intro.centerTextXMobile ?? 0)
      : kind === "tablet"
        ? (intro.centerTextXTablet ?? 0)
        : (intro.centerTextXDesktop ?? 0);
  const centerTextY =
    kind === "mobile"
      ? (intro.centerTextYMobile ?? 0)
      : kind === "tablet"
        ? (intro.centerTextYTablet ?? 0)
        : (intro.centerTextYDesktop ?? 0);
  const [revealed, setRevealed] = useState(false);
  const [burst, setBurst] = useState(false);
  const [paused, setPaused] = useState(false);
  const [needleAngle, setNeedleAngle] = useState(0);
  const [moving, setMoving] = useState(false);
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ px: number; py: number; x: number; y: number } | null>(null);
  const movedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const moveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastAngleRef = useRef(0);
  const n = items.length;
  const show = revealed || !intro.enabled;
  const variant = REVEAL_VARIANTS[intro.animation] ?? REVEAL_VARIANTS.explode!;
  const dur = Math.max(200, intro.durationMs) / 1000;

  const handleReveal = () => {
    if (movedRef.current) {
      movedRef.current = false;
      return;
    }
    if (intro.particles) {
      setBurst(true);
      window.setTimeout(() => setBurst(false), intro.durationMs + 400);
    }
    setRevealed(true);
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem("wheel_cta_offset");
      if (raw) setDrag(JSON.parse(raw) as { x: number; y: number });
    } catch {
      /* ignore */
    }
  }, []);

  const onCtaPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragStart.current = { px: e.clientX, py: e.clientY, x: drag.x, y: drag.y };
    movedRef.current = false;
    setDragging(true);
  };

  const onCtaPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const s = dragStart.current;
    if (!s) return;
    const nx = s.x + (e.clientX - s.px);
    const ny = s.y + (e.clientY - s.py);
    if (Math.abs(e.clientX - s.px) > 4 || Math.abs(e.clientY - s.py) > 4) movedRef.current = true;
    setDrag({ x: nx, y: ny });
  };

  const onCtaPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (dragStart.current) {
      try {
        localStorage.setItem("wheel_cta_offset", JSON.stringify(drag));
      } catch {
        /* ignore */
      }
    }
    dragStart.current = null;
    setDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };


  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const point = "touches" in e ? e.touches[0] : (e as MouseEvent);
      if (!point) return;
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const deg = (Math.atan2(point.clientY - cy, point.clientX - cx) * 180) / Math.PI + 90;
        const prev = lastAngleRef.current;
        let delta = deg - (prev % 360);
        if (delta > 180) delta -= 360;
        else if (delta < -180) delta += 360;
        const next = prev + delta;
        lastAngleRef.current = next;
        setNeedleAngle(next);
        setMoving(true);
        if (moveTimerRef.current) clearTimeout(moveTimerRef.current);
        moveTimerRef.current = setTimeout(() => setMoving(false), 250);
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      if (moveTimerRef.current) clearTimeout(moveTimerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section className="container mx-auto px-4 mt-10 mb-8" dir="rtl">
      <div className="relative overflow-hidden rounded-3xl bg-primary-soft px-4 sm:px-6">
      <CityscapeBackdrop />
      <WheelBackground />
      <div className="relative z-10 text-center mb-6 pt-6">
        <h2 className="font-extrabold text-foreground leading-relaxed tracking-tight whitespace-nowrap text-[clamp(1.1rem,3.2vw,2rem)]">
          ارائه کلیه <span className="text-primary">خدمات بیمه‌ای</span> در سریع‌ترین زمان ممکن
        </h2>
        <p className="text-sm sm:text-base text-red-600 font-extrabold mt-2 tracking-wide whitespace-nowrap">
          بیمه سامان کد ۸۴۵۲ آذرخش، همراه همیشگی شما
        </p>
      </div>

      {/* Stage: fixed square area shared by the CTA and the wheel so the
          section box never changes size when the red button is clicked. */}
      <div className="relative z-10 mx-auto w-full aspect-square max-w-[560px]">
      <AnimatePresence>
        {!show && (
          <motion.div
            key="wheel-cta"
            className="absolute inset-0 z-20 flex flex-col items-center justify-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, filter: "blur(6px)" }}
            transition={{ duration: 0.35 }}
          >
            <div
              className="flex flex-col items-center"
              style={{
                transform: `translate(calc(${intro.buttonX ?? 0}% + ${drag.x}px), calc(${intro.buttonY ?? 0}% + ${drag.y}px)) scale(${intro.buttonScale ?? 1})`,
                animation: intro.float && !dragging ? "ve-float 3.2s ease-in-out infinite" : undefined,
              }}
            >
              <motion.button
                type="button"
                onClick={handleReveal}
                onPointerDown={onCtaPointerDown}
                onPointerMove={onCtaPointerMove}
                onPointerUp={onCtaPointerUp}
                title="برای جابجایی، دکمه را با موس بکشید"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`cta-sheen relative overflow-hidden group inline-flex items-center gap-3 rounded-full px-8 sm:px-12 py-4 sm:py-5 text-white font-extrabold text-base sm:text-2xl shadow-[0_22px_45px_-16px_rgba(220,38,38,0.75)] bg-[linear-gradient(120deg,#b91c1c_0%,#dc2626_35%,#f43f5e_60%,#dc2626_100%)] ring-4 ring-white/60 touch-none ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
              >
                <span className="absolute -inset-1 rounded-full bg-red-500/30 blur-xl animate-[ve-pulse_2.2s_ease-in-out_infinite]" aria-hidden="true" />
                <ShoppingCart className="relative w-6 h-6 sm:w-8 sm:h-8" />
                <span className="relative">{intro.buttonText}</span>
                <Sparkles className="relative w-5 h-5 sm:w-6 sm:h-6 opacity-90" />
              </motion.button>
              <span className="mt-4 text-xs sm:text-sm font-bold text-foreground/70">{intro.hintText}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {burst && (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center" aria-hidden="true">
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i / 24) * Math.PI * 2;
            return (
              <motion.span
                key={i}
                className="absolute w-2.5 h-2.5 rounded-full bg-red-500"
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: Math.cos(a) * 280, y: Math.sin(a) * 280, opacity: 0, scale: 0.3 }}
                transition={{ duration: dur, ease: "easeOut" }}
              />
            );
          })}
        </div>
      )}

      {show && (
      <motion.div
        ref={containerRef}
        initial={variant.initial}
        animate={variant.animate}
        transition={{ type: "spring", stiffness: 120, damping: 12, duration: dur }}
        className="absolute inset-0 z-10"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >


        {/* Decorative orbit rings */}
        <div className="absolute inset-[4%] rounded-full border border-red-200/60" />
        <div className="absolute inset-[14%] rounded-full border border-red-100/70" />

        {/* Rotating ring (CSS animation — cheap, GPU) */}
        <div
          className="absolute inset-0 wheel-spin"
          style={{ animationPlayState: paused ? "paused" : "running" }}
        >
          {items.map((it, i) => {
            const angle = (i * 360) / n - 90; // start at top
            const rad = (angle * Math.PI) / 180;
            const radius = 42; // percent of container
            const x = 50 + radius * Math.cos(rad);
            const y = 50 + radius * Math.sin(rad);
            const Icon = it.icon;
            return (
              <div
                key={it.href + i}
                className="absolute"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  className="wheel-spin-reverse"
                  style={{ animationPlayState: paused ? "paused" : "running" }}
                >
                  <Link
                    to={it.href as never}
                    preload="intent"
                    className="group flex flex-col items-center justify-center gap-1 w-[78px] sm:w-[92px] text-center"
                  >
                    <div className="w-[58px] h-[58px] sm:w-[68px] sm:h-[68px] rounded-2xl bg-white border border-slate-100 shadow-[0_8px_24px_-10px_rgba(15,30,80,0.18)] flex items-center justify-center group-hover:-translate-y-0.5 group-hover:shadow-[0_14px_30px_-12px_rgba(220,38,38,0.35)] transition-all">
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary group-hover:text-red-600 transition-colors" />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-foreground/80 leading-tight px-1 mt-1">
                      {it.title}
                    </span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Fixed center disc — logo/shield circle centered on the wheel pivot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42%] aspect-square rounded-full bg-white shadow-[0_18px_40px_-14px_rgba(15,30,80,0.22)]">
          <div
            className={
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden flex items-center justify-center shadow-lg transition-shadow duration-300 " +
              (intro.centerImageUrl ? "bg-white " : "bg-gradient-to-br from-red-500 to-red-700 ") +
              (moving ? "shield-pulse-navy" : "")
            }
            style={{ width: intro.centerImageSize || 56, height: intro.centerImageSize || 56 }}
          >
            {intro.centerImageUrl ? (
              <img src={intro.centerImageUrl} alt={intro.centerTitle} className="w-full h-full object-contain" />
            ) : (
              <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            )}
          </div>
          {/* Title + subtitle below the logo */}
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-[14%] w-[85%] text-center"
            style={{ marginInlineStart: `${centerTextX}px`, marginBlockStart: `${centerTextY}px` }}
          >
            <h3 className="text-sm sm:text-base font-extrabold text-foreground leading-tight">
              {intro.centerTitle}
            </h3>
            <p className="text-[10px] sm:text-[11px] text-foreground/60 leading-snug mt-1">
              {intro.centerSubtitle}
            </p>
          </div>
        </div>


        {/* Needle that follows the mouse */}
        <motion.div
          className="pointer-events-none absolute top-1/2 left-1/2 z-20 origin-top"
          style={{ x: "-50%", y: "0%" }}
          animate={{ rotate: needleAngle - 180 }}
          transition={{ type: "tween", ease: "easeOut", duration: 0.25 }}
        >
          <div className="relative flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-red-600 shadow-md -mb-1 z-10" />
            <div
              className="w-1.5 bg-gradient-to-b from-red-500 to-red-600 rounded-full"
              style={{ height: `${Math.max(30, needleLen)}px` }}
            />
            <div
              className="w-0 h-0 -mt-0.5"
              style={{
                borderLeft: "9px solid transparent",
                borderRight: "9px solid transparent",
                borderTop: "22px solid #dc2626",
                filter: "drop-shadow(0 2px 6px rgba(220,38,38,0.5))",
              }}
            />
          </div>
        </motion.div>
      </motion.div>
      )}
      </div>



      {/* News ticker — replaces ground vehicle animation */}
      <div className="relative z-20 mt-6 mb-4 mx-2 sm:mx-4 rounded-3xl bg-white/90 backdrop-blur border border-red-100 shadow-[0_8px_24px_-12px_rgba(15,30,80,0.18)] overflow-hidden" dir="rtl">
        <AnnouncementTicker
          items={announcements}
          gapPx={intro.tickerGapPx ?? 320}
          speedSec={intro.tickerSpeedSec ?? 40}
          schematic={intro.tickerSchematic ?? true}
        />
      </div>
      </div>
    </section>
  );
}

/**
 * Wrapper: on the home page the section always shows in full.
 * On inner pages the admin picks how it appears (full / collapse / modal / bubble)
 * so visitors notice a new page opened, and can always restore the button state.
 */
export function InsuranceWheel() {
  const intro = useSiteSetting<WheelIntroSettings>("wheel_intro", DEFAULT_WHEEL_INTRO);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/" || pathname === "";
  const mode = intro.innerMode ?? "collapse";
  const [open, setOpen] = useState(false);
  const dur = Math.max(150, intro.innerAnimMs ?? 500) / 1000;
  const label = intro.innerLabel || "ارائه کلیه خدمات بیمه‌ای در سریع‌ترین زمان ممکن";

  if (isHome || mode === "full") return <WheelSection />;

  const trigger = (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={label}
      title={label}
      className="w-full text-right group flex items-center justify-between gap-3 rounded-2xl border border-red-100 bg-card/90 backdrop-blur px-4 sm:px-6 py-2.5 shadow-[0_10px_28px_-16px_rgba(15,30,80,0.25)] hover:border-red-300 transition"
    >
      <BrandCartBadge size={40} />
      <span className="flex-1 min-w-0">
        <AnnouncementTicker
          items={announcements}
          gapPx={intro.tickerGapPx ?? 320}
          speedSec={intro.tickerSpeedSec ?? 40}
          schematic={intro.tickerSchematic ?? true}
        />
      </span>
      <span className="shrink-0 inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-extrabold text-red-600">
        {intro.buttonText}
        <Sparkles className="w-4 h-4" />
      </span>
    </button>
  );

  const closeBtn = (
    <button
      type="button"
      onClick={() => setOpen(false)}
      aria-label="بستن"
      className="inline-flex items-center gap-1.5 rounded-full bg-card border border-border px-4 py-2 text-xs font-extrabold text-foreground shadow-soft hover:border-red-300 transition"
    >
      <X className="w-4 h-4" /> بستن
    </button>
  );

  if (mode === "collapse") {
    return (
      <div dir="rtl">
        {!open && <div className="container mx-auto px-4 mt-8">{trigger}</div>}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="wheel-collapse"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: dur, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <WheelSection />
              <div className="container mx-auto px-4 -mt-4 mb-8 flex justify-center">{closeBtn}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div dir="rtl">
      {mode === "modal" ? (
        <div className="container mx-auto px-4 mt-8">{trigger}</div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={label}
          title={label}
          className="fixed z-40 bottom-5 left-5 rounded-full grid place-items-center shadow-[0_18px_40px_-14px_rgba(220,38,38,0.8)] ring-4 ring-white/60 hover:scale-105 transition-transform animate-[ve-pulse_2.4s_ease-in-out_infinite]"
        >
          <BrandCartBadge size={56} />
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            key="wheel-modal"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto p-3 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: dur * 0.6 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="mx-auto w-full max-w-4xl rounded-3xl bg-background shadow-2xl overflow-hidden"
              initial={{ scale: 0.85, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 12, opacity: 0 }}
              transition={{ duration: dur, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-3 px-4 sm:px-6 pt-4">
                <span className="text-xs sm:text-sm font-extrabold text-foreground truncate">{label}</span>
                {closeBtn}
              </div>
              <WheelSection />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default InsuranceWheel;