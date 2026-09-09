import { useEffect, useState } from "react";
import { useSiteSetting } from "@/hooks/use-site-setting";
import {
  DEFAULT_WHEEL_BACKGROUND,
  pickWheelBgIndex,
  type WheelBackgroundSettings,
} from "@/lib/site-config";

const FALLBACK_BG = "https://si8452.ir/img/50a0af3b.png";

/**
 * Background of the "ارائه کلیه خدمات بیمه‌ای" section.
 * Images, zoom, focal point and the rotation mode (timed slideshow, hourly,
 * daily, monthly or seasonal) are all managed from the dashboard.
 */
export function WheelBackground() {
  const cfg = useSiteSetting<WheelBackgroundSettings>("wheel_background", DEFAULT_WHEEL_BACKGROUND);
  const [tick, setTick] = useState(0);

  const images = cfg.enabled ? (cfg.images ?? []).filter((i) => i.url?.trim()) : [];

  useEffect(() => {
    if (cfg.mode !== "interval" || images.length < 2) return;
    const ms = Math.max(1500, cfg.intervalMs || 8000);
    const id = setInterval(() => setTick((t) => t + 1), ms);
    return () => clearInterval(id);
  }, [cfg.mode, cfg.intervalMs, images.length]);

  if (images.length === 0) {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url("${FALLBACK_BG}")` }}
      />
    );
  }

  const active = pickWheelBgIndex({ ...cfg, images }, new Date(), tick);
  const fade = Math.max(0, cfg.fadeMs ?? 900);

  return (
    <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {images.map((img, i) => (
        <div
          key={`${img.url}-${i}`}
          className="absolute inset-0 bg-no-repeat"
          style={{
            backgroundImage: `url("${img.url}")`,
            backgroundSize: cfg.fit === "contain" ? "contain" : "cover",
            backgroundPosition: `${img.posX ?? 50}% ${img.posY ?? 50}%`,
            transform: `scale(${Math.max(50, img.zoom ?? 100) / 100})`,
            transformOrigin: `${img.posX ?? 50}% ${img.posY ?? 50}%`,
            opacity: i === active ? 1 : 0,
            transition: `opacity ${fade}ms ease-in-out`,
          }}
        />
      ))}
      <div
        className="absolute inset-0 bg-white"
        style={{ opacity: Math.min(100, Math.max(0, cfg.overlay ?? 0)) / 100 }}
      />
    </div>
  );
}

export default WheelBackground;
