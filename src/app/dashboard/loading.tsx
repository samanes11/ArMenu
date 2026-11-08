import { Skeleton } from "@/components/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-10">
      <section>
        <Skeleton className="mb-4 h-7 w-40" />
        <div className="admin-card grid gap-4 p-5 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-full" />
          ))}
        </div>
      </section>

      <section>
        <Skeleton className="mb-4 h-7 w-56" />
        <ul className="admin-card divide-y divide-white/10 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="flex items-center gap-4 p-4">
              <Skeleton className="h-14 w-14 shrink-0 rounded-xl" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="h-7 w-12 rounded-full" />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
