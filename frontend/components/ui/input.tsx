import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border border-white/[0.09] bg-[#111111] px-4 py-2 text-sm text-[#f4f2ee] shadow-sm transition-all duration-200 placeholder:text-[#9a968e] placeholder:font-mono placeholder:text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff4d1f]/60 focus-visible:border-[#ff4d1f]/40 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
