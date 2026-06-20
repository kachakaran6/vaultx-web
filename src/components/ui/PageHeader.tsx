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
    <header className={cn("flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 animate-in fade-in duration-300", className)}>
      <div className="flex flex-col gap-2">
        {eyebrow && (
          <span className="text-xs font-semibold tracking-wide text-text-faint uppercase">
            {eyebrow}
          </span>
        )}
        <h1 className="text-xl font-semibold text-text tracking-tight leading-none">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-text-muted">
            {description}
          </p>
        )}
      </div>
      
      {actions && (
        <div className="flex items-center gap-3 shrink-0 h-9">
          {actions}
        </div>
      )}
    </header>
  );
}
