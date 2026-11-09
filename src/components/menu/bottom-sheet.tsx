"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";

export function BottomSheet({
  open,
  onClose,
  ariaLabel,
  children,
}: {
  open: boolean;
  onClose: () => void;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent title={ariaLabel}>{children}</SheetContent>
    </Sheet>
  );
}
