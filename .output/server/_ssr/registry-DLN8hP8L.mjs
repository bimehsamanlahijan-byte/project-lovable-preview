import { r as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./rolldown-runtime-D7D4PA-g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/registry-DLN8hP8L.js
var registry_DLN8hP8L_exports = /* @__PURE__ */ __exportAll({
	a: () => registry_exports,
	i: () => TELEGRAM_CALLBACK_PATH,
	n: () => LOGIN_MODULES,
	r: () => LOGIN_PROVIDERS,
	t: () => LOGIN_MODE_LABELS
});
var registry_exports = /* @__PURE__ */ __exportAll$1({
	AI_CHAT_FREE_QUESTIONS: () => 5,
	LOGIN_MODE_LABELS: () => LOGIN_MODE_LABELS,
	LOGIN_MODULES: () => LOGIN_MODULES,
	LOGIN_PROVIDERS: () => LOGIN_PROVIDERS,
	TELEGRAM_CALLBACK_PATH: () => TELEGRAM_CALLBACK_PATH,
	TELEGRAM_START_PATH: () => TELEGRAM_START_PATH
});
var LOGIN_MODULES = [
	{
		key: "third_party",
		label: "استعلام و خرید بیمه شخص ثالث"
	},
	{
		key: "inquiries",
		label: "سایر استعلام‌ها"
	},
	{
		key: "ai_chat",
		label: "چت هوش مصنوعی"
	},
	{
		key: "live_chat",
		label: "چت آنلاین"
	},
	{
		key: "damage_report",
		label: "اعلام خسارت"
	},
	{
		key: "documents",
		label: "مخزن مدارک مشتریان"
	}
];
var LOGIN_PROVIDERS = [
	{
		id: "telegram",
		label: "ورود با تلگرام",
		available: true,
		startPath: "/api/public/auth/telegram/start"
	},
	{
		id: "phone",
		label: "ورود با شماره موبایل",
		available: false
	},
	{
		id: "email",
		label: "ورود با ایمیل",
		available: false
	},
	{
		id: "google",
		label: "ورود با گوگل",
		available: false
	}
];
var LOGIN_MODE_LABELS = {
	required: "ورود اجباری",
	optional: "ورود اختیاری",
	none: "بدون نیاز به ورود"
};
var TELEGRAM_CALLBACK_PATH = "/api/public/auth/telegram/callback";
//#endregion
export { registry_DLN8hP8L_exports as a, TELEGRAM_CALLBACK_PATH as i, LOGIN_MODULES as n, LOGIN_PROVIDERS as r, LOGIN_MODE_LABELS as t };
