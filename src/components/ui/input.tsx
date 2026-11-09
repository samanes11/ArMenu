import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({ className, type, ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      "w-full rounded-md border border-input bg-black/55 px-3 py-2 text-sm text-white outline-none [color-scheme:dark] placeholder:text-menu-muted focus:border-gold-400 focus:ring-[3px] focus:ring-[color-mix(in_srgb,var(--gold-400)_22%,transparent)] file:me-3 file:rounded-sm file:border file:border-gold-500 file:bg-transparent file:px-3 file:py-1 file:text-xs file:text-gold-400",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export { Input };
