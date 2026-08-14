import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import { normalizeBase, type SeoConfig } from "./seo-config";

export const getSeoConfig = createServerFn({ method: "GET" }).handler(
  async (): Promise<SeoConfig & { origin: string }> => {
    const { readSeoConfig, originFromRequest } = await import("./seo.server");
    const seo = await readSeoConfig();
    let origin = normalizeBase(seo.siteUrl);
    if (!origin) {
      try {
        origin = originFromRequest(getRequest());
      } catch {
        origin = "";
      }
    }
    return { ...seo, origin };
  },
);
