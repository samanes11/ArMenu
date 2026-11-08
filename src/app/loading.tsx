import { Skeleton } from "@/components/skeleton";

export default function HomeLoading() {
  return (
    <main className="menu-theme menu-green relative min-h-[100dvh] overflow-hidden">
      <div
        className="relative z-10 mx-auto flex w-full max-w-xl flex-col items-center px-3"
        style={{ paddingTop: "calc(47dvh - 40px)" }}
      >
        <Skeleton className="h-16 w-56 rounded-xl" />
        <div
          dir="ltr"
          className="mt-16 flex items-end justify-center gap-[clamp(3px,1vw,6px)]"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex w-[clamp(54px,16vw,72px)] flex-col items-center"
            >
              <Skeleton className="aspect-[70/110] w-full rounded-t-full" />
              <Skeleton className="mt-3 h-4 w-10" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
