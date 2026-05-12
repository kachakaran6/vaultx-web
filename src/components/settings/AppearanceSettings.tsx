import { motion } from "framer-motion";
import { Check, Moon, Sun, Monitor } from "lucide-react";
import { useTheme, AccentColor, ThemeMode } from "../ThemeProvider";
import { cn } from "../../utils/cn";

const ACCENTS: { id: AccentColor; label: string; hex: string }[] = [
  { id: "blue", label: "Blue", hex: "#2563eb" },
  { id: "purple", label: "Purple", hex: "#9333ea" },
  { id: "emerald", label: "Emerald", hex: "#10b981" },
  { id: "orange", label: "Orange", hex: "#f97316" },
  { id: "pink", label: "Pink", hex: "#ec4899" },
  { id: "slate", label: "Slate", hex: "#64748b" },
];

const THEMES: { id: ThemeMode; label: string; icon: any }[] = [
  { id: "system", label: "Auto", icon: Monitor },
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
];

export function AppearanceSettings() {
  const { theme, accent, setTheme, setAccent } = useTheme();

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <div className="space-y-2.5">
        <label className="text-[12px] font-semibold text-muted-foreground">Interface Theme</label>
        <div className="flex p-1 bg-secondary/60 rounded-md w-full border border-border/60 relative">
          {THEMES.map((t) => {
            const isActive = theme === t.id;
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={cn(
                  "relative flex items-center justify-center flex-1 h-9 rounded-sm text-[13px] font-medium transition-all z-10 gap-2",
                  isActive ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeThemeCompact"
                    className="absolute inset-0 bg-card rounded-sm shadow-sm border border-border/60 z-[-1]"
                    transition={{ type: "spring", bounce: 0.1, duration: 0.3 }}
                  />
                )}
                <Icon size={14} className={cn(isActive ? "text-primary" : "opacity-70")} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accent Palette */}
      <div className="space-y-2.5">
        <label className="text-[12px] font-semibold text-muted-foreground">Accent Color</label>
        <div className="grid grid-cols-6 gap-3">
          {ACCENTS.map((a) => {
            const isSelected = accent === a.id;
            return (
              <button
                key={a.id}
                onClick={() => setAccent(a.id)}
                className="group relative flex items-center justify-center outline-none aspect-square cursor-pointer"
                title={a.label}
              >
                <div
                  className={cn(
                    "relative w-full h-full rounded-full flex items-center justify-center transition-all duration-200",
                    isSelected ? "scale-100 shadow-sm" : "scale-90 opacity-80 hover:opacity-100 hover:scale-95"
                  )}
                  style={{ backgroundColor: a.hex }}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-white"
                    >
                      <Check size={14} strokeWidth={4} />
                    </motion.div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
