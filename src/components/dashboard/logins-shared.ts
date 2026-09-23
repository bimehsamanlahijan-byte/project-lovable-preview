import type { LoginMode } from "@/lib/auth/registry";

export type LoginsTab = "requirements" | "telegram" | "users" | "logs" | "bot";

export const LOGIN_MODES_ORDER: LoginMode[] = ["required", "optional", "none"];
