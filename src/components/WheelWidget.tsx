import { useSiteSetting } from "@/hooks/use-site-setting";
import { buildSandboxDocument } from "@/lib/overlays";
import { DEFAULT_WHEEL_WIDGET, type WheelWidgetSettings } from "@/lib/site-config";

export function WheelWidget() {
  const cfg = useSiteSetting<WheelWidgetSettings>("wheel_widget", DEFAULT_WHEEL_WIDGET);
  if (!cfg.enabled || !cfg.html.trim()) return null;
  return (
    <iframe
      title={cfg.name || "انیمیشن خدمات بیمه‌ای"}
      sandbox="allow-scripts"
      srcDoc={buildSandboxDocument(cfg.html)}
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full border-0"
    />
  );
}