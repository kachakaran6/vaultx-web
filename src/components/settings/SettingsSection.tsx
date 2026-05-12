import { ReactNode } from "react";

interface SettingsSectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SettingsSection({ title, icon, children, className = "" }: SettingsSectionProps) {
  return (
    <section className={`space-y-6 ${className}`}>
      <div className="flex items-center gap-3 pb-3 border-b border-border/40">
        <div className="text-primary flex-shrink-0">
          {icon}
        </div>
        <h2 className="text-lg font-extrabold text-foreground tracking-tight uppercase tracking-[0.05em]">{title}</h2>
      </div>
      <div className="px-1">
        {children}
      </div>
    </section>
  );
}
