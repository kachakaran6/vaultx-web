import { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface BadgeProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "outline" | "glass";
}

export function Badge({ children, className, variant = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium tracking-wide uppercase",
        {
          "bg-vault-400/10 text-vault-300 border border-vault-400/20": variant === "default",
          "border border-white/10 text-neutral-400": variant === "outline",
          "bg-white/5 text-white/80 backdrop-blur-md border border-white/10": variant === "glass",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
