import { Skeleton } from "@/components/ui/skeleton";

export default function DishDetailLoading() {
  return (
    <main className="menu-theme mx-auto min-h-[100dvh] max-w-2xl px-4 py-5">
      <Skeleton className="h-[440px] w-full rounded-[1.75rem]" />
      <div className="mt-6 space-y-3">
        <Skeleton className="h-7 w-2/3" />
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-20 w-full" />
      </div>
    </main>
  );
}
