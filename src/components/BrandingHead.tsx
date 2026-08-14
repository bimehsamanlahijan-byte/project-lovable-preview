import { useEffect } from "react";
import { useBranding } from "@/hooks/use-branding";

/** Applies the dashboard-managed title, description and favicon to the live site. */
export function BrandingHead() {
  const b = useBranding();

  useEffect(() => {
    if (b.siteTitle && !document.title.includes("پیشخوان")) document.title = b.siteTitle;

    if (b.siteDescription) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", b.siteDescription);
    }

    if (b.faviconUrl) {
      document.querySelectorAll('link[rel="icon"]').forEach((n) => n.remove());
      const link = document.createElement("link");
      link.rel = "icon";
      link.href = b.faviconUrl;
      document.head.appendChild(link);
    }
  }, [b.siteTitle, b.siteDescription, b.faviconUrl]);

  return null;
}
