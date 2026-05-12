import { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "dark" | "light" | "system";
export type AccentColor = "blue" | "purple" | "emerald" | "orange" | "pink" | "slate";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: ThemeMode;
  accent: AccentColor;
  neo: boolean;
  setTheme: (theme: ThemeMode) => void;
  setAccent: (accent: AccentColor) => void;
  setNeo: (enabled: boolean) => void;
};

const initialState: ThemeProviderState = {
  theme: "dark",
  accent: "blue",
  neo: true, // Enabled by default for maximum premium aesthetics
  setTheme: () => null,
  setAccent: () => null,
  setNeo: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "vaultx-theme-config",
  ...props
}: ThemeProviderProps) {
  
  // Load composite state from LocalStorage
  const [config, setConfig] = useState(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) { /* corrupted, fallback to default */ }
    }
    return {
      theme: defaultTheme,
      accent: "blue",
      neo: true,
    };
  });

  const saveConfig = (partial: any) => {
    const newConfig = { ...config, ...partial };
    setConfig(newConfig);
    localStorage.setItem(storageKey, JSON.stringify(newConfig));
  };

  useEffect(() => {
    const root = window.document.documentElement;
    const { theme, accent, neo } = config;

    // 1. Handle Theme Switching (Dark/Light)
    root.classList.remove("light", "dark");
    let resolvedTheme = theme;
    if (theme === "system") {
      resolvedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    root.classList.add(resolvedTheme);
    
    // 2. Expose explicitly as Data Attributes for Tailwind / CSS Variables
    root.setAttribute("data-theme", resolvedTheme);
    root.setAttribute("data-accent", accent);
    root.setAttribute("data-neo", neo.toString());
    
  }, [config]);

  const value = {
    theme: config.theme as ThemeMode,
    accent: config.accent as AccentColor,
    neo: config.neo as boolean,
    setTheme: (theme: ThemeMode) => saveConfig({ theme }),
    setAccent: (accent: AccentColor) => saveConfig({ accent }),
    setNeo: (neo: boolean) => saveConfig({ neo }),
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
