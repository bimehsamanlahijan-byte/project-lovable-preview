import { o as __toESM } from "../_runtime.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { It as ChartColumn, N as Percent, Z as Layers, a as Wallet } from "../_libs/lucide-react.mjs";
import { n as SiteHeader, t as SiteFooter } from "./SiteFooter-HIYvUQRB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/partners.dashboard-Czo2IRmL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var fmt = (n) => n.toLocaleString("fa-IR");
function PartnerDashboardPage() {
	const [code, setCode] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [stats, setStats] = (0, import_react.useState)(null);
	const load = async (e) => {
		e.preventDefault();
		if (!code.trim()) return;
		setLoading(true);
		setError("");
		setStats(null);
		try {
			const r = await fetch(`/api/public/partner-stats?code=${encodeURIComponent(code.trim())}`);
			const data = await r.json().catch(() => ({}));
			if (r.ok && data.ok) setStats(data);
			else if (r.status === 404) setError("همکاری با این کد یافت نشد یا غیرفعال است.");
			else setError("خطا در دریافت اطلاعات. لطفاً دوباره تلاش کنید.");
		} catch {
			setError("خطا در ارتباط با سرور.");
		}
		setLoading(false);
	};
	const maxBranch = stats ? Math.max(...stats.branches.map((b) => b.amount), 1) : 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "gradient-hero text-primary-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "container mx-auto px-4 py-12 md:py-16",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl md:text-4xl font-extrabold mb-3",
						children: "پنل همکاران تیم 8452"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm md:text-base opacity-90 max-w-2xl leading-7",
						children: "کد همکاری خود را وارد کنید تا وضعیت پورسانت، میزان فروش و فروش به تفکیک شاخه‌های بیمه‌ای را ببینید."
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "container mx-auto px-4 py-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: load,
						className: "bg-card rounded-3xl p-6 md:p-8 shadow-elegant border border-border flex flex-col md:flex-row gap-3 md:items-end max-w-2xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-medium mb-1.5",
								children: "کد همکاری"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: code,
								onChange: (e) => setCode(e.target.value),
								placeholder: "مثلاً 8452-001",
								dir: "ltr",
								className: "w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring transition text-left"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: loading,
							className: "gradient-primary text-primary-foreground px-8 py-3 rounded-xl font-bold shadow-elegant hover:shadow-glow transition disabled:opacity-60",
							children: loading ? "در حال دریافت..." : "مشاهده گزارش"
						})]
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 max-w-2xl text-sm text-center rounded-xl px-4 py-3 bg-destructive/10 text-destructive",
						children: error
					}),
					stats && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-card rounded-3xl p-6 shadow-elegant border border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-extrabold text-lg",
									children: stats.partner.fullName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground mt-1",
									dir: "ltr",
									children: stats.partner.code
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Percent, { className: "w-6 h-6" }),
										label: "درصد پورسانت",
										value: `${fmt(stats.partner.commissionPercent)}٪`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "w-6 h-6" }),
										label: "تعداد فروش",
										value: fmt(stats.totalSales)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "w-6 h-6" }),
										label: "میزان فروش (ریال)",
										value: fmt(stats.totalAmount)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "w-6 h-6" }),
										label: "پورسانت شما (ریال)",
										value: fmt(stats.commissionAmount)
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-card rounded-3xl p-6 md:p-8 shadow-elegant border border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-extrabold text-lg mb-5",
									children: "فروش به تفکیک شاخه بیمه‌ای"
								}), stats.branches.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "هنوز فروشی ثبت نشده است."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-5",
									children: stats.branches.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between text-sm mb-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold",
												children: b.branch
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-muted-foreground",
												children: [
													fmt(b.count),
													" فروش — ",
													fmt(b.amount),
													" ریال"
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-3 bg-muted rounded-full overflow-hidden",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-full gradient-primary rounded-full transition-all",
												style: { width: `${Math.max(4, Math.round(b.amount / maxBranch * 100))}%` }
											})
										}),
										b.types.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex flex-wrap gap-2 mt-2",
											children: b.types.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs bg-primary-soft text-primary rounded-full px-3 py-1",
												children: [
													t.label,
													" (",
													fmt(t.count),
													")"
												]
											}, t.label))
										})
									] }, b.branch))
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function StatCard({ icon, label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-card rounded-3xl p-5 shadow-elegant border border-border",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-primary mb-2",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground mb-1",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-extrabold text-lg",
				dir: "ltr",
				children: value
			})
		]
	});
}
//#endregion
export { PartnerDashboardPage as component };
