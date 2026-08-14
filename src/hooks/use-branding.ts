import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_BRANDING, type Branding } from "@/lib/site-config";
import { SITE_LOGO, SITE_LOGO_HEADER } from "@/components/site-data";

/** Live branding values, readable by every visitor. */
export function useBranding(): Branding {
  const [branding, setBranding] = useState<Branding>({
    ...DEFAULT_BRANDING,
    headerLogoUrl: SITE_LOGO_HEADER,
    footerLogoUrl: SITE_LOGO,
  });

  useEffect(() => {
    let alive = true;
    void (async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "branding")
        .maybeSingle();
      if (!alive || !data?.value) return;
      const v = data.value as Partial<Branding>;
      setBranding((prev) => ({
        ...prev,
        ...Object.fromEntries(Object.entries(v).filter(([, val]) => val !== "" && val != null)),
      }));
    })();
    return () => {
      alive = false;
    };
  }, []);

  return branding;
}
