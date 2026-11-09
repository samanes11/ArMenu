import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-md border border-input bg-black/55 px-3 py-2 text-sm text-white outline-none [color-scheme:dark] placeholder:text-menu-muted focus:border-gold-400 focus:ring-[3px] focus:ring-[color-mix(in_srgb,var(--gold-400)_22%,transparent)]",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
