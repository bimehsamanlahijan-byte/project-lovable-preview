import type { ComponentType } from "react";

/** Circular launcher button shared by the live-chat and AI widgets. */
export function WidgetLauncher({
  onClick,
  iconUrl,
  Icon,
  label,
  size,
  open,
}: {
  onClick: () => void;
  iconUrl?: string;
  Icon: ComponentType<{ className?: string }>;
  label: string;
  size: number;
  open: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      style={{ width: size, height: size }}
      className={`grid place-items-center rounded-full overflow-hidden text-white shadow-xl hover:shadow-2xl transition ring-2 ring-white/70 ${
        open ? "opacity-90" : ""
      }`}
    >
      {iconUrl ? (
        <img src={iconUrl} alt={label} className="w-full h-full object-cover" />
      ) : (
        <span
          className="w-full h-full grid place-items-center"
          style={{ background: "linear-gradient(135deg,#0b1e3f 0%,#16305f 60%,#24467f 100%)" }}
        >
          <Icon className="w-1/2 h-1/2" />
        </span>
      )}
    </button>
  );
}
