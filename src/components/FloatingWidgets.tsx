import { useRouterState } from "@tanstack/react-router";
import { AiChatWidget } from "./AiChatWidget";
import { LiveChatWidget } from "./LiveChatWidget";

export function FloatingWidgets() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname.startsWith("/dashboard")) return null;
  return (
    <>
      <LiveChatWidget />
      <AiChatWidget />
    </>
  );
}
