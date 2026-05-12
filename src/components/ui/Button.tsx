import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "../../utils/cn";

type ButtonVariant = "primary" | "secondary" | "subtle" | "ghost" | "outline" | "neu";
type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  leftIcon,
  rightIcon,
  ...props
}: ButtonProps) {
  
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer";
  
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
    secondary: "bg-card text-foreground border border-border hover:bg-secondary shadow-sm",
    subtle: "bg-secondary text-foreground hover:bg-border/50",
    neu: "bg-secondary text-foreground hover:bg-border/50", // Bridging legacy
    outline: "border border-border bg-transparent text-foreground hover:bg-secondary",
    ghost: "text-muted-foreground hover:text-foreground hover:bg-secondary",
  };

  const sizes = {
    sm: "h-[34px] px-3.5 text-[12px] font-semibold gap-1.5 rounded-[8px]",
    md: "h-10 px-4 text-[13px] font-semibold gap-2 rounded-[10px]",
    lg: "h-[46px] px-5 text-[14px] font-bold gap-2 rounded-[12px]",
    xl: "h-[52px] px-7 text-base font-bold gap-3 rounded-[12px]",
  };

  // Ensure framer-motion is only handling minimal animation as requested
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant as keyof typeof variants], sizes[size], className)}
      {...props}
    >
      {leftIcon && <span className="flex-shrink-0 flex items-center justify-center">{leftIcon}</span>}
      <span className="leading-none">{children}</span>
      {rightIcon && <span className="flex-shrink-0 flex items-center justify-center">{rightIcon}</span>}
    </motion.button>
  );
}
