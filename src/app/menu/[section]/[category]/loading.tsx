import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryLoading() {
  return (
    <div className="relative px-3 pb-28 pt-6 sm:px-6">
      <Skeleton className="mx-auto mt-10 h-10 w-48" />
      <div className="mx-auto mt-9 grid max-w-[620px] grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-7 lg:max-w-[860px] lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-[14px] border border-menu-line bg-[var(--menu-bg)]">
            <Skeleton className="aspect-[7/6] w-full rounded-none" />
            <div className="space-y-2 bg-menu-card p-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
