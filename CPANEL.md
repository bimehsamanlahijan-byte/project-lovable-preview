# دیپلوی خودکار GitHub → cPanel (یک‌بار تنظیم)

مسیر: Lovable → GitHub main → GitHub Action → cPanel (pull + `.cpanel.yml`) → `npm run build:cpanel` → کپی به پوشه اپ → Restart Passenger.
دیپلوی Cloudflare (`deploy-cloudflare.yml`) دست‌نخورده است.

## ۱) Setup Node.js App
Node 20+، Application root مثلاً `/home/USER/samanapp`، startup file: `app.cjs`، متغیرها در Environment variables یا `.env` داخل همان پوشه (شامل `VITE_SUPABASE_URL`، `VITE_SUPABASE_PUBLISHABLE_KEY` و بقیه).

## ۲) Git Version Control
Create → Clone URL مخزن GitHub، Repository Path مثلاً `/home/USER/repositories/saman` (با مسیر اپ یکی نباشد). برای مخزن خصوصی، SSH Key هاست را در GitHub → Deploy keys اضافه کنید.

## ۳) فایل تنظیم روی هاست (خارج از گیت)
در File Manager فایل `/home/USER/.cpanel-deploy.env` بسازید:
```
APP_ROOT=/home/USER/samanapp
```

## ۴) توکن API
cPanel → Security → Manage API Tokens → یک توکن بسازید.

## ۵) Secretهای GitHub
Repo → Settings → Secrets and variables → Actions:
`CPANEL_HOST` (مثلاً example.com)، `CPANEL_USER`، `CPANEL_TOKEN`، `CPANEL_REPO_PATH` (مسیر مرحله ۲).

از این به بعد هر Commit روی main خودکار دیپلوی می‌شود. اجرای دستی: cPanel → Git Version Control → Manage → Pull or Deploy → Deploy HEAD Commit. لاگ: GitHub → Actions و `~/.cpanel/logs`.

---

# راهنمای کوتاه اجرا روی cPanel (Node.js / Passenger)

این راهنما فقط یک روش دیپلوی «اضافه» است. دیپلوی فعلی روی Cloudflare (GitHub Actions → Wrangler → Worker → دامنه) بدون هیچ تغییری باقی می‌ماند.

## فایل‌های اضافه‌شده برای cPanel
| فایل | نقش |
| --- | --- |
| `app.cjs` | فایل startup برای Passenger؛ فقط خروجی بیلد Node را اجرا می‌کند |
| `scripts/build-cpanel.mjs` | بیلد پروژه با هدف `node-server` (بدون تغییر بیلد Cloudflare) |
| `cpanel/.env.example` | فهرست متغیرهای محیطی لازم |
| `cpanel/htaccess.example` | نمونه تنظیم Passenger (فقط برای تنظیم دستی) |
| `cpanel/websocket-polyfill.cjs` | سازگاری WebSocket برای Node 20 (فقط مسیر cPanel) |
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

## چت هوش مصنوعی روی cPanel
چت روی Cloudflare کار می‌کند چون کلید ارائه‌دهنده به‌صورت Secret روی Worker ست شده است.
روی cPanel همان متغیرها باید دوباره وارد شوند (Secretهای Cloudflare به هاست منتقل نمی‌شوند).

1. در Cloudflare → Workers & Pages → پروژه → **Settings → Variables and secrets** ببینید کدام کلید ست شده است
   (`LOVABLE_API_KEY` یا `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` یا `GEMINI_API_KEY`/`GROQ_API_KEY`/...).
   مقدار Secret قابل مشاهده نیست؛ همان مقدار اصلی را از منبعش بردارید یا یک توکن جدید بسازید.
2. همان نام و مقدار را در cPanel → **Setup Node.js App → Environment variables** اضافه کنید
   (یا در فایل `.env` کنار `app.cjs`).
3. **Restart** بزنید.
4. بررسی: `https://دامنه/api/public/env-check` — در بخش `ai.ready` باید نام ارائه‌دهنده‌ی انتخاب‌شده دیده شود.
   اگر خالی بود یعنی کلید روی هاست ست نشده است.

خطای «پاسخ‌گویی هوش مصنوعی موقتاً ممکن نیست» تقریباً همیشه یعنی کلید ارائه‌دهنده روی cPanel وجود ندارد
یا با ارائه‌دهنده‌ی انتخاب‌شده در پنل مدیریت هم‌خوانی ندارد.

## نکته‌ها
- `PORT` را خودتان تنظیم نکنید؛ Passenger آن را می‌دهد.
- بعد از هر تغییر در متغیرهای `VITE_*` باید دوباره `build:cpanel` بگیرید.
- برای به‌روزرسانی: بیلد جدید بگیرید، پوشه `.output` را جایگزین کنید و Restart بزنید.

## رفع دو خطای رایج روی cPanel

### ۱) `Cannot find module scripts/build-cpanel.mjs`
این خطا وقتی رخ می‌دهد که فقط بسته‌ی آماده (`cpanel-build.zip`) روی هاست باشد؛ در نسخه‌های قبلی بسته، پوشه‌ی `scripts/` داخل زیپ نبود.
- بسته‌ی جدید (Actions → Build for cPanel) حالا شامل `scripts/build-cpanel.mjs`، پوشه‌ی `cpanel/` و `node_modules/ws` است.
- نکته‌ی مهم: وقتی از بسته‌ی آماده استفاده می‌کنید **نیازی به اجرای `build:cpanel` روی هاست نیست**؛ خروجی `.output/` از قبل ساخته شده است. فقط `app.cjs` را به‌عنوان startup file بگذارید و Restart بزنید.
- اگر می‌خواهید روی خود هاست بیلد کنید، باید کل مخزن (با پوشه‌های `src/`, `scripts/`, `package.json`) روی هاست باشد و اول `npm install` اجرا شود.

### ۲) `Node.js detected but native WebSocket not found`
Node 20 (نسخه‌ی موجود روی cPanel) برخلاف Node 22 (Cloudflare) `WebSocket` سراسری ندارد.
فایل `cpanel/websocket-polyfill.cjs` که از `app.cjs` بارگذاری می‌شود این را به‌صورت خودکار حل می‌کند:
1. اگر Node نسخه ۲۲+ باشد، از WebSocket داخلی استفاده می‌شود.
2. در غیر این صورت از پکیج `ws` استفاده می‌شود (در بسته‌ی آماده موجود است؛ در نصب دستی با `npm install ws`).
3. اگر هیچ‌کدام نبود، برنامه با فلگ `--experimental-websocket` دوباره اجرا می‌شود.

هیچ‌کدام از این تغییرات روی بیلد و دیپلوی Cloudflare Worker اثری ندارد.
