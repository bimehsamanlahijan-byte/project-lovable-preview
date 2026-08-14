import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  DEFAULT_SOCIAL_LAYOUT,
  readSetting,
  type SocialLayout,
  type SocialLink,
} from "@/lib/site-config";
import { SocialIcon } from "./SocialIcon";

export function SocialBar({ className = "" }: { className?: string }) {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [layout, setLayout] = useState<SocialLayout>(DEFAULT_SOCIAL_LAYOUT);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [{ data }, cfg] = await Promise.all([
        supabase
          .from("social_links")
          .select("*")
          .eq("is_active", true)
          .order("position", { ascending: true }),
        readSetting<SocialLayout>("social_layout", DEFAULT_SOCIAL_LAYOUT),
      ]);
      if (!alive) return;
      setLinks((data ?? []) as SocialLink[]);
      setLayout(cfg);
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (links.length === 0) return null;

  const justify =
    layout.align === "center" ? "justify-center" : layout.align === "end" ? "justify-end" : "justify-start";

  const containerClass =
    layout.layout === "grid"
      ? `grid grid-cols-3 sm:grid-cols-4 ${justify}`
      : layout.layout === "column"
        ? `flex flex-col ${layout.align === "center" ? "items-center" : layout.align === "end" ? "items-end" : "items-start"}`
        : `flex flex-wrap items-center ${justify}`;

  return (
    <div className={`${containerClass} ${className}`} style={{ gap: layout.gap }}>
      {links.map((l) => (
        <a
          key={l.id}
          href={l.url}
          target={l.url.startsWith("http") ? "_blank" : undefined}
          rel="noopener noreferrer"
          title={`${l.label}${l.username ? ` — ${l.username}` : ""}`}
          className="flex items-center gap-2 hover:opacity-80 transition"
        >
          <SocialIcon
            platform={l.platform}
            iconKey={l.icon_key}
            customIconUrl={l.custom_icon_url}
            size={l.size_px}
            shape={layout.shape}
            label={l.label}
          />
          {(layout.showLabels || layout.showUsernames) && (
            <span className="text-xs leading-5">
              {layout.showLabels && <span className="font-bold">{l.label}</span>}
              {layout.showUsernames && l.username && (
                <span className="opacity-80 block" dir="ltr">
                  {l.username}
                </span>
              )}
            </span>
          )}
        </a>
      ))}
    </div>
  );
}
