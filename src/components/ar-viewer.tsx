"use client";

// پوشاننده‌ی وب‌کامپوننت model-viewer: نمایش مدل سه‌بعدی + دکمه‌ی شناور
// "مشاهده روی میز" که دوربین گوشی را برای واقعیت‌افزوده باز می‌کند.
export function ArViewer({
  glbSrc,
  usdzSrc,
  alt,
  posterSrc,
}: {
  glbSrc: string;
  usdzSrc?: string;
  alt: string;
  posterSrc?: string;
}) {
  return (
    <div className="materialize relative overflow-hidden rounded-[1.75rem] border border-menu-line bg-menu-card">
      <model-viewer
        src={glbSrc}
        ios-src={usdzSrc || undefined}
        alt={alt}
        ar
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="auto"
        ar-placement="floor"
        camera-controls
        auto-rotate
        rotation-per-second="18deg"
        shadow-intensity="1.1"
        environment-image="neutral"
        exposure="1"
        interaction-prompt="auto"
        poster={posterSrc}
        style={{
          width: "100%",
          height: "440px",
          backgroundColor: "transparent",
          ["--progress-bar-color" as string]: "var(--brand-600)",
          ["--poster-color" as string]: "transparent",
        }}
      >
        {/* فیدبک وضعیت: بارگذاری تدریجی به‌جای پرش ناگهانی */}
        <div slot="progress-bar" className="absolute inset-x-6 bottom-5 h-1 overflow-hidden rounded-full bg-black/10">
          <div className="h-full w-full origin-right scale-x-0 rounded-full bg-brand-600 transition-transform duration-300 [model-viewer[loaded]_&]:scale-x-100" />
        </div>

        {/* دکمه‌ی شناور AR — متریال تیره‌ی نیمه‌شفاف روی مدل، با فیدبک آنی روی لمس */}
        <button
          slot="ar-button"
          className="pressable material-chip pop-in absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full px-5 py-3 text-sm font-medium shadow-chip"
          style={{ ["--delay" as string]: "260ms" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path d="M12 12v9M12 12 4 7.5M12 12l8-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
          مشاهده روی میز
        </button>
      </model-viewer>
    </div>
  );
}
