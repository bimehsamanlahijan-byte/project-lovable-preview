import {
  Send,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Phone,
  Mail,
  Globe,
  MessageCircle,
  Twitter,
} from "lucide-react";

type Meta = { color: string; text?: string; Icon?: React.ComponentType<{ className?: string }> };

export const PLATFORM_META: Record<string, Meta> = {
  telegram: { color: "#229ED9", Icon: Send },
  whatsapp: { color: "#25D366", Icon: MessageCircle },
  instagram: { color: "#E1306C", Icon: Instagram },
  facebook: { color: "#1877F2", Icon: Facebook },
  linkedin: { color: "#0A66C2", Icon: Linkedin },
  youtube: { color: "#FF0000", Icon: Youtube },
  x: { color: "#111827", Icon: Twitter },
  phone: { color: "#0EA5E9", Icon: Phone },
  email: { color: "#6B7280", Icon: Mail },
  website: { color: "#0F766E", Icon: Globe },
  eitaa: { color: "#F5A623", text: "ایتا" },
  bale: { color: "#00A6A6", text: "بله" },
  rubika: { color: "#8B5CF6", text: "روبیکا" },
  soroush: { color: "#1D4ED8", text: "سروش" },
  igap: { color: "#0891B2", text: "آی‌گپ" },
  gap: { color: "#16A34A", text: "گپ" },
  viber: { color: "#7360F2", text: "وایبر" },
  aparat: { color: "#E11D48", text: "آپارات" },
};

export function SocialIcon({
  platform,
  iconKey,
  customIconUrl,
  size,
  shape = "circle",
  label,
}: {
  platform: string;
  iconKey?: string | null;
  customIconUrl?: string | null;
  size: number;
  shape?: "circle" | "rounded" | "square";
  label?: string;
}) {
  const meta = PLATFORM_META[(iconKey || platform || "").toLowerCase()] ?? {
    color: "#334155",
    text: (label || platform || "?").slice(0, 4),
  };
  const radius = shape === "circle" ? "9999px" : shape === "rounded" ? "14px" : "4px";

  if (customIconUrl) {
    return (
      <img
        src={customIconUrl}
        alt={label || platform}
        loading="lazy"
        style={{ width: size, height: size, borderRadius: radius }}
        className="object-cover shadow-sm"
      />
    );
  }

  const Icon = meta.Icon;
  return (
    <span
      style={{ width: size, height: size, borderRadius: radius, backgroundColor: meta.color }}
      className="inline-grid place-items-center text-white shadow-sm shrink-0"
      aria-hidden="true"
    >
      {Icon ? (
        <Icon className="w-1/2 h-1/2" />
      ) : (
        <span style={{ fontSize: Math.max(9, size * 0.3) }} className="font-extrabold leading-none px-0.5">
          {meta.text}
        </span>
      )}
    </span>
  );
}
