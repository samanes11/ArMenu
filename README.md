# دیش‌آر (نسخه‌ی MongoDB)

این نسخه، بازپیاده‌سازیِ پروژه‌ی [CalGuo/DishAR](https://github.com/CalGuo/DishAR) است؛ همان ایده (منوی AR روی میز رستوران با کد QR) اما به‌جای Supabase (Postgres + Auth + Storage)، از **MongoDB** و یک لایه‌ی احراز هویت سبک خودمان استفاده می‌کند، و برای رستوران‌های ایرانی بومی‌سازی شده: رابط کاربری فارسی و راست‌به‌چپ (RTL) و قیمت‌گذاری به **تومان**.

## چه چیزی عوض شده؟

| بخش | نسخه‌ی اصلی (Supabase) | این نسخه (MongoDB) |
|---|---|---|
| دیتابیس | PostgreSQL + ۶ migration SQL | MongoDB + مدل‌های Mongoose (`src/lib/models`) |
| احراز هویت | Supabase Auth | JWT در کوکی httpOnly با `jose` + هش رمز با `bcryptjs` (`src/lib/auth.ts`) |
| کنترل دسترسی | Row Level Security در دیتابیس | بررسی `restaurantId` در هر Server Action + میان‌افزار مسیر (`src/middleware.ts`) |
| فایل‌ها (مدل GLB/USDZ، تصاویر) | Supabase Storage | ذخیره‌ی محلی در `public/uploads/<restaurantId>/...` (`src/lib/storage.ts`) |
| زبان/جهت | انگلیسی، LTR | فارسی، RTL، فونت Vazirmatn |
| پول | دلار | تومان (`formatToman` در `src/lib/format.ts`) |

> ⚠️ ذخیره‌سازی فایل روی دیسک محلی برای توسعه مناسب است، اما در هاستینگ‌های بدون دیسک پایدار (مثل Vercel) فایل‌ها بین دیپلوی‌ها پاک می‌شوند. برای پروداکشن، تابع `saveUploadedFile` در `src/lib/storage.ts` را با آپلود به یک سرویس S3-سازگار (مثلاً Cloudflare R2، Arvan Cloud Object Storage یا MinIO) جایگزین کنید؛ امضای تابع همان می‌ماند.

## شروع به کار

### پیش‌نیازها

- Node.js 18 به بالا
- یک دیتابیس MongoDB (لوکال با Docker، یا رایگان روی [MongoDB Atlas](https://www.mongodb.com/atlas))

### نصب

```bash
npm install
cp .env.example .env.local
```

مقادیر `.env.local` را پر کنید:

```
MONGODB_URI=mongodb://localhost:27017/dishar
JWT_SECRET=یک-رشته-تصادفی-و-طولانی
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

برای ساخت یک `JWT_SECRET` تصادفی:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### اجرا

```bash
npm run dev
```

آدرس <http://localhost:3000> را باز کنید.

## ساختار پروژه

```
src/
├── middleware.ts            # محافظت از مسیرهای /dashboard و /onboarding
├── lib/
│   ├── db.ts                 # اتصال به MongoDB (Mongoose، با کش برای hot reload)
│   ├── auth.ts                # ساخت/بررسی JWT، کوکی جلسه، هش رمز
│   ├── storage.ts             # ذخیره‌ی فایل آپلودی (قابل جایگزینی با S3)
│   ├── format.ts               # فرمت قیمت به تومان، ساخت slug
│   ├── models/                 # اسکیماهای Mongoose: User, Restaurant, Dish, MenuEvent
│   └── actions/                # Server Actionها: auth, restaurant, dish, events
├── app/
│   ├── login/ register/         # صفحات ورود و ثبت‌نام
│   ├── onboarding/                # ساخت رستوران بعد از ثبت‌نام
│   ├── dashboard/                  # پنل صاحب رستوران: لیست غذاها، QR، تنظیمات
│   └── r/[slug]/[dishId]/           # منوی عمومی + نمایش AR هر غذا
└── components/
    └── ar-viewer.tsx                # پوشاننده‌ی وب‌کامپوننت <model-viewer>
```

## نکاتی برای ادامه‌ی کار

این یک **اسکلت کارکردی** است، نه نسخه‌ی کامل و پروداکشن‌ریدی پروژه‌ی اصلی. موارد زیر در پروژه‌ی اصلی وجود داشت و اینجا ساده‌سازی یا حذف شده؛ بسته به نیازتان می‌توانید اضافه کنید:

- **مولد مدل دمو** (`/api/demo-model` در پروژه‌ی اصلی) برای تست بدون مدل سه‌بعدی واقعی
- **جابه‌جایی ترتیب غذاها** (drag & drop reorder)
- **آنالیتیکس داشبورد** (نمودار اسکن/بازدید هر غذا) — کالکشن `MenuEvent` از قبل داده‌ها را ذخیره می‌کند، فقط صفحه‌ی نمایش آن نوشته نشده
- **تایید ایمیل / بازیابی رمز عبور**
- **احراز هویت با شماره موبایل ایرانی (OTP)** — اگر می‌خواهید به‌جای ایمیل باشد، باید سرویس پیامک (مثل Kavenegar یا Ghasedak) را به `src/lib/actions/auth.ts` وصل کنید
