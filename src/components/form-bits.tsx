import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function Field({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export function FormError({ message, className }: { message?: string; className?: string }) {
  if (!message) return null;
  return <p role="alert" className={cn("rounded-md bg-destructive/60 px-3 py-2 text-[13px] font-medium text-destructive-foreground", className)}>{message}</p>;
}
