# راهنمای کوتاه اجرا روی cPanel (Node.js / Passenger)

این راهنما فقط یک روش دیپلوی «اضافه» است. دیپلوی فعلی روی Cloudflare (GitHub Actions → Wrangler → Worker → دامنه) بدون هیچ تغییری باقی می‌ماند.

## فایل‌های اضافه‌شده برای cPanel
| فایل | نقش |
| --- | --- |
| `app.cjs` | فایل startup برای Passenger؛ فقط خروجی بیلد Node را اجرا می‌کند |
| `scripts/build-cpanel.mjs` | بیلد پروژه با هدف `node-server` (بدون تغییر بیلد Cloudflare) |
| `cpanel/.env.example` | فهرست متغیرهای محیطی لازم |
| `cpanel/htaccess.example` | نمونه تنظیم Passenger (فقط برای تنظیم دستی) |
| `.github/workflows/build-cpanel.yml` | (اختیاری) ساخت بسته آماده‌ی cPanel با یک کلیک در GitHub |
| اسکریپت‌های `build:cpanel` و `start:cpanel` در `package.json` | دستورهای بیلد و اجرا |

خروجی بیلد cPanel در پوشه `.output/` ساخته می‌شود و با `dist/` (Cloudflare) تداخلی ندارد.

## پیش‌نیازها
- cPanel با **Setup Node.js App** (Passenger) و Node.js **۲۰ یا بالاتر**
- توصیه: بیلد را روی کامپیوتر خودتان یا GitHub انجام دهید و فقط خروجی را آپلود کنید (هاست اشتراکی معمولاً حافظه کافی برای بیلد ندارد).

## ۱) ساخت بسته (روی کامپیوتر خودتان یا GitHub)
```bash
npm install            # یا bun install
export VITE_SUPABASE_URL=...
export VITE_SUPABASE_PUBLISHABLE_KEY=...
export VITE_SUPABASE_PROJECT_ID=...
npm run build:cpanel
```
یا در GitHub: **Actions → Build for cPanel → Run workflow** و فایل `cpanel-build.zip` را دانلود کنید.

## ۲) آپلود روی هاست
این موارد را در پوشه‌ی اپ (مثلاً `/home/USER/samanapp`) قرار دهید:
```
.output/          ← کل پوشه (server + public + nitro.json)
app.cjs
package.json
.env              ← از روی cpanel/.env.example
```
نیازی به `node_modules` یا `npm install` روی هاست نیست؛ خروجی بیلد خودکفاست.

## ۳) تنظیم در cPanel → Setup Node.js App
| گزینه | مقدار |
| --- | --- |
| Node.js version | 20.x یا بالاتر |
| Application mode | Production |
| Application root | پوشه‌ای که فایل‌ها را آپلود کردید |
| Application URL | دامنه/زیر‌دامنه پشتیبان |
| Application startup file | `app.cjs` |

متغیرهای محیطی را یا در همان صفحه (Environment variables) وارد کنید یا در فایل `.env` کنار `app.cjs`. سپس **Restart** بزنید.

## ۴) بررسی
- صفحه اصلی دامنه باز شود.
- `https://دامنه/api/public/env-check` باید `dbProbe.status = 200` نشان دهد.
- در صورت خطا: cPanel → Setup Node.js App → لاگ‌ها (`stderr.log` در Application root).

## نکته‌ها
- `PORT` را خودتان تنظیم نکنید؛ Passenger آن را می‌دهد.
- بعد از هر تغییر در متغیرهای `VITE_*` باید دوباره `build:cpanel` بگیرید.
- برای به‌روزرسانی: بیلد جدید بگیرید، پوشه `.output` را جایگزین کنید و Restart بزنید.
