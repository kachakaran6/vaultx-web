import React from "react";
import { cn } from "../../utils/cn";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ eyebrow, title, description, actions, className }: PageHeaderProps) {
  return (
    <header className={cn("flex flex-col md:flex-row md:items-end justify-between gap-6 mb-7 animate-in fade-in duration-500", className)}>
      <div className="space-y-1.5">
        {eyebrow && (
          <span className="block text-[12px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
            {eyebrow}
          </span>
        )}
        <h1 className="text-[32px] font-[650] tracking-[-0.03em] leading-[1.1] text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-[14px] font-normal text-muted-foreground leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>
      
      {actions && (
        <div className="flex items-center gap-3 shrink-0 md:pb-1">
          {actions}
        </div>
      )}
    </header>
  );
}
