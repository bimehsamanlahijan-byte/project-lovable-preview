# سیستم مرکزی مدیریت لاگین

زیرساخت مشترک ورود کاربران برای همه بخش‌های سایت (Provider-based).

## ساختار
- `src/lib/auth/registry.ts` — فهرست ماژول‌ها و روش‌های ورود (client-safe)
- `src/lib/auth/session.server.ts` — نشست امن کاربر (کوکی رمزنگاری‌شده، httpOnly)
- `src/lib/auth/store.server.ts` — کاربران، هویت‌ها، کاربران تلگرام، قوانین و لاگ‌ها
- `src/lib/auth/guard.server.ts` — اعمال قانون ورود در سمت سرور
- `src/lib/auth/telegram.server.ts` — OIDC تلگرام + اعتبارسنجی ویجت ورود
- `src/lib/auth.functions.ts` — توابع سرور برای فرانت (وضعیت کاربر، خروج، شماره تماس)
- `src/routes/login.tsx` — صفحه ورود کاربران
- `src/routes/api/public/auth/telegram/start.ts` و `callback.ts`
- `src/routes/api/public/telegram/bot-ai.ts` — وبهوک ربات → هوش مصنوعی
- `src/components/dashboard/LoginsPane.tsx` — منوی «لاگین‌ها» در پیشخوان

## جداول (migration: `supabase/migrations/20260923090000_central_login_system.sql`)
`site_users`, `auth_identities`, `telegram_users`, `login_requirements`, `login_logs`
— RLS فعال و بدون دسترسی عمومی؛ فقط service_role.

## Secrets مورد نیاز
- `SESSION_SECRET` (حداقل ۳۲ کاراکتر)
- `TELEGRAM_CLIENT_ID`, `TELEGRAM_CLIENT_SECRET`
- `TELEGRAM_LOGIN_BOT_TOKEN`
- اختیاری: `TELEGRAM_OIDC_AUTH_URL`, `TELEGRAM_OIDC_TOKEN_URL`, `TELEGRAM_OIDC_USERINFO_URL`, `PUBLIC_SITE_URL`

## آدرس‌ها
- شروع ورود: `https://saman8452.ir/api/public/auth/telegram/start`
- Redirect URI: `https://saman8452.ir/api/public/auth/telegram/callback`
- صفحه ورود: `https://saman8452.ir/login`
- وبهوک ربات: `https://saman8452.ir/api/public/telegram/bot-ai`
