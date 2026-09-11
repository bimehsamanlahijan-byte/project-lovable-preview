import { useEffect, useState } from "react";

export type DeviceKind = "desktop" | "tablet" | "mobile";

function read(): DeviceKind {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

/** Current breakpoint bucket (mobile < 768 ≤ tablet < 1024 ≤ desktop). */
export function useDeviceKind(): DeviceKind {
  const [kind, setKind] = useState<DeviceKind>("desktop");

  useEffect(() => {
    const onResize = () => setKind(read());
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return kind;
}
