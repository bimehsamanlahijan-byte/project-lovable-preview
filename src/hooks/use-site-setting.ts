import { useEffect, useState } from "react";
import { readSetting } from "@/lib/site-config";

/** Public read of a site_settings row, merged over the given fallback. */
export function useSiteSetting<T extends object>(key: string, fallback: T): T {
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    let alive = true;
    void readSetting<T>(key, fallback).then((v) => {
      if (alive) setValue(v);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return value;
}
