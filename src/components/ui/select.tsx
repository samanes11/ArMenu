import * as React from "react";
import { cn } from "@/lib/utils";

// Native <select> styled like shadcn (keeps <optgroup> + FormData support, zero JS).
const Select = React.forwardRef<HTMLSelectElement, React.ComponentProps<"select">>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "w-full rounded-md border border-input bg-black/55 px-3 py-2 text-sm text-white outline-none [color-scheme:dark] focus:border-gold-400 focus:ring-[3px] focus:ring-[color-mix(in_srgb,var(--gold-400)_22%,transparent)] [&_option]:bg-[#101712] [&_optgroup]:bg-[#101712]",
      className
    )}
    {...props}
  />
));
Select.displayName = "Select";

export { Select };
