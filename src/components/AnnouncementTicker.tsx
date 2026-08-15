import { SITE_LOGO_HEADER } from "./site-data";

/**
 * Looping announcement bar with an adjustable empty gap between the last and
 * the first announcement, plus a schematic strip that visualises that gap.
 */
export function AnnouncementTicker({
  items,
  gapPx = 320,
  speedSec = 40,
  schematic = true,
  className = "",
}: {
  items: string[];
  gapPx?: number;
  speedSec?: number;
  schematic?: boolean;
  className?: string;
}) {
  const gapShare = Math.min(60, Math.round((gapPx / (gapPx + items.length * 420)) * 100));

  return (
    <div className={`w-full min-w-0 ${className}`} dir="rtl">
      <div className="overflow-hidden py-2">
        <div
          className="marquee-track text-[12px] sm:text-sm text-foreground/85 font-semibold"
          style={{ animationDuration: `${Math.max(8, speedSec)}s` }}
        >
          {items.map((text, i) => (
            <span key={i} className="inline-flex items-center mx-6">
              <img alt="بیمه سامان" className="h-6 w-auto object-contain mx-2" loading="lazy" src={SITE_LOGO_HEADER} />
              <span>{text}</span>
              <img alt="بیمه سامان" className="h-6 w-auto object-contain mx-2" loading="lazy" src={SITE_LOGO_HEADER} />
              {i < items.length - 1 && <span className="text-red-500 mx-2">◆</span>}
            </span>
          ))}
          {/* Adjustable empty space before the first announcement returns */}
          <span className="inline-block" style={{ width: Math.max(0, gapPx) }} aria-hidden="true" />
        </div>
      </div>

      {schematic && (
        <div className="flex items-center gap-1 px-4 pb-1.5" aria-hidden="true">
          <div className="flex-1 flex items-center gap-[2px] h-1.5">
            {items.map((_, i) => (
              <span key={i} className="flex-1 h-full rounded-full bg-red-400/70" />
            ))}
            <span
              className="h-full rounded-full bg-slate-300/70"
              style={{ width: `${gapShare}%`, minWidth: 6 }}
              title="فاصله خالی تا اعلان اول"
            />
          </div>
          <span className="text-[9px] font-bold text-slate-400 tabular-nums">{gapShare}%</span>
        </div>
      )}
    </div>
  );
}

export default AnnouncementTicker;
