# انتشار پروژه روی Cloudflare Pages و اتصال دامنه اختصاصی

این پروژه با TanStack Start ساخته شده و خروجی بیلد آن به‌صورت پیش‌فرض برای Cloudflare Workers/Pages آماده است.

## ۱) تنظیمات بیلد
| مورد | مقدار |
| --- | --- |
| Build command | `bun run build` |
| Deploy command | `npx wrangler deploy --config dist/server/wrangler.json` |
| خروجی استاتیک | `dist/client` (به‌صورت خودکار به Worker متصل می‌شود) |
| خروجی سرور (Worker) | `dist/server` به همراه `wrangler.json` تولیدشده |
| Node/Bun | Bun (پیش‌فرض) |
| Compatibility flags | `nodejs_compat` |

## ۲) متغیرهای محیطی (Settings → Variables and Secrets)
برای هر دو محیط Production و Preview ثبت شوند:

| نام | نوع | توضیح |
| --- | --- | --- |
| `LOVABLE_API_KEY` | Secret | کلید دروازه هوش مصنوعی؛ بدون آن هیچ موتور هوش مصنوعی روی Cloudflare پاسخ نمی‌دهد |
| `SUPABASE_URL` | Text | آدرس سرویس داده (سمت سرور) |
| `SUPABASE_PUBLISHABLE_KEY` | Text | کلید عمومی سرویس داده (سمت سرور) |
| `VITE_SUPABASE_URL` | Text | آدرس سرویس داده برای سمت مرورگر |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Text | کلید عمومی سمت مرورگر |
| `VITE_SUPABASE_PROJECT_ID` | Text | شناسه پروژه سرویس داده |

نکته: متغیرهای `VITE_*` در زمان بیلد درون کد قرار می‌گیرند، بنابراین پس از تغییر آن‌ها باید دوباره Deploy انجام شود.

## ۳) دامنه اختصاصی
1. در پروژه Pages به بخش **Custom domains** بروید.
2. دامنه اصلی (مثلاً `example.ir`) و در صورت نیاز `www.example.ir` را اضافه کنید.
3. رکوردهای DNS پیشنهادی Cloudflare را ثبت کنید (اگر DNS دامنه در Cloudflare است، رکوردها خودکار ساخته می‌شود).
4. منتظر صدور گواهی SSL بمانید؛ سپس آدرس دامنه را در فهرست آدرس‌های مجاز احراز هویت اضافه کنید.

## ۴) بخش‌های سرور پروژه
- `/api/ai-chat` — نقطه اتصال چت هوش مصنوعی؛ مدل، دستور رفتاری و دانش تأییدشده را از پایگاه داده می‌خواند (قابل تغییر از پیشخوان → «چت هوش مصنوعی»).
- چت روم آنلاین از Realtime پایگاه داده استفاده می‌کند و به تنظیم اضافی در Cloudflare نیاز ندارد.
- مدارک مشتریان در مخزن خصوصی `customer-documents` ذخیره می‌شود؛ دریافت فایل‌ها فقط از پیشخوان و با لینک امضاشده انجام می‌شود.

## ۵) مدیریت از پیشخوان
| بخش | امکانات |
| --- | --- |
| شبکه‌های اجتماعی | افزودن/حذف شبکه، نام کاربری، لینک، اندازه لوگو، شکل و نوع چینش در فوتر |
| چت هوش مصنوعی | انتخاب موتور هوش مصنوعی، دستور رفتاری، دانش تأییدشده برای اصلاح اطلاعات محصولات |
| چت روم آنلاین | مشاهده و پاسخ زنده، حذف پیام، فعال/غیرفعال کردن |
| مخزن مدارک | دسته‌های قابل ویرایش، وضعیت بررسی، دریافت فایل |
| انتشار در Cloudflare | دامنه، نام پروژه، دستور بیلد و فهرست متغیرها |

## ۶) سئو و نمایش صفحات زیر نتیجه گوگل
- بخش «سئو و نتایج گوگل» در پیشخوان: دامنه اصلی، عنوان/توضیح پیش‌فرض و فهرست صفحات (افزودن، حذف، جابه‌جایی ترتیب).
- خروجی خودکار: `/sitemap.xml` و `/robots.txt` بر اساس همان فهرست ساخته می‌شوند.
- داده ساختاریافته `WebSite` و `SiteNavigationElement` در صفحه اصلی درج می‌شود تا گوگل صفحات انتخابی را به‌عنوان سایت‌لینک زیر دامنه اصلی نشان دهد.
- پس از اتصال دامنه در Cloudflare: آدرس دامنه را در پیشخوان ثبت کنید، سپس در Google Search Console دامنه را تأیید و `https://دامنه/sitemap.xml` را ثبت کنید.

## ۶.۱) رفع مشکل «ذخیره نشدن تغییرات پیشخوان» روی Cloudflare
همه ذخیره‌سازی‌های پیشخوان (ویرایشگر بصری، سئو و نتایج گوگل، منوها، رسانه‌ها) با «کلید سرور» بک‌اند انجام می‌شوند.
- کد اکنون این کلید را هم از `process.env` و هم از Bindings/Secrets خود Worker می‌خواند و نام‌های جایگزین را هم می‌پذیرد: `SUPABASE_SERVICE_ROLE_KEY`، `SUPABASE_SERVICE_KEY`، `SUPABASE_SECRET_KEY`، `SUPABASE_SERVICE_ROLE`، `SERVICE_ROLE_KEY`.
- نشانی بک‌اند از `SUPABASE_URL` یا `VITE_SUPABASE_URL` و کلید عمومی از `SUPABASE_PUBLISHABLE_KEY`/`VITE_SUPABASE_PUBLISHABLE_KEY`/`SUPABASE_ANON_KEY` خوانده می‌شود.
- اگر کلید سرور اصلاً ثبت نشده باشد، پیشخوان به‌جای «ذخیره شد» پیام روشن فارسی نشان می‌دهد و توضیح می‌دهد کدام متغیر کم است.
- نشست پیشخوان از `SESSION_SECRET` یا `DASHBOARD_SESSION_SECRET` (حداقل ۳۲ نویسه) استفاده می‌کند.
پس از ثبت این مقادیر در Settings → Variables and Secrets، حتماً یک Deploy تازه انجام دهید.

## ۷) انتشار خودکار از گیت‌هاب (CI/CD)
فایل `.github/workflows/deploy-cloudflare.yml` هر push به شاخه `main` را می‌گیرد، پروژه را `bun run build` می‌کند و با `npx wrangler deploy --config dist/server/wrangler.json` روی Cloudflare منتشر می‌کند.

برای فعال‌سازی این زنجیره باید **کد منبع کامل پروژه** در مخزن گیت‌هاب موجود باشد و با هر ویرایش در Lovable به‌روز شود:
1. در **Project Settings → GitHub** پروژه‌ی Lovable، مخزن گیت‌هاب را متصل کنید تا کد منبع دوطرفه سینک شود (هر ویرایش در Lovable به‌صورت commit به گیت‌هاب می‌رود و Actions را روشن می‌کند). پنل «اتصال و انتشار در گیت‌هاب» در پیشخوان فقط فایل پشتیبان `site-content.json` را می‌فرستد و جایگزین این سینک کامل نیست.
2. در گیت‌هاب: **Settings → Secrets and variables → Actions** این رازها را ثبت کنید:
   - `CLOUDFLARE_API_TOKEN` — توکن با دسترسی Edit Cloudflare Workers (Cloudflare → My Profile → API Tokens)
   - `CLOUDFLARE_ACCOUNT_ID` — شناسه حساب (Cloudflare → هر پروژه →右侧 Account ID)
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID` (در زمان بیلد در کد کلاینت پخته می‌شوند)

### متغیرهای زمان اجرا (روی Worker در Cloudflare، یک‌بار تنظیم می‌شوند)
در پنل Cloudflare: **Workers & Pages → \<worker شما\> → Settings → Variables and Secrets** این موارد را اضافه کنید (در دیپلویهای بعدی حفظ می‌شوند):

| نام | نوع | توضیح |
| --- | --- | --- |
| `SUPABASE_URL` | Text | آدرس سرویس داده سمت سرور |
| `SUPABASE_PUBLISHABLE_KEY` | Text | کلید عمومی سمت سرور |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret | کلید سرویس (RLS را دور می‌زند) — **الزامی برای پیشخوان مدیریت**؛ بدون آن عملیات دیتابیس پیشخوان خطا می‌دهد |
| `LOVABLE_API_KEY` | Secret | کلید دروازه هوش مصنوعی (چت + اتصال گیت‌هاب) |
| `DASHBOARD_PASSWORD` | Secret | رمز ورود پیشخوان |
| `SESSION_SECRET` | Secret | رمز نشست پیشخوان |
| `GITHUB_API_KEY` | Secret | توکن گیت‌هاب (برای ارسال خودکار snapshot از پیشخوان؛ اختیاری) |

> توجه: `SUPABASE_SERVICE_ROLE_KEY` برای کارکرد پیشخوان مدیریت روی Cloudflare اختصاصی الزامی است. این کلید در محیط Lovable Cloud قابل دریافت نیست؛ اگر به‌صورت خودمیزبان روی Cloudflare خودتان منتشر می‌کنید، باید این کلید را از پروژه‌ی سرویس داده خود تهیه و به‌عنوان Secret ثبت کنید. بخش‌های عمومی سایت (صفحات بیمه، چت، فرم‌ها) با همان کلید عمومی و RLS کار می‌کنند و به این کلید نیاز ندارند.
