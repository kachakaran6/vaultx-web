import { useLocation, Link } from "react-router-dom";
import { Search, Plus, Moon, Sun, Monitor, Sparkles, ChevronRight, Command, X } from "lucide-react";
import { useAppStore } from "../store/app-store";
import { useTheme } from "./ThemeProvider";
import { Button } from "./ui/button";
import { cn } from "../utils/cn";

const ROUTE_LABELS: Record<string, string> = {
  "/home": "Home",
  "/categories": "Collections",
  "/stats": "Analytics",
  "/settings": "Settings",
};

export function GlobalHeader() {
  const location = useLocation();
  const { searchQuery, setSearchQuery, openAddDialog } = useAppStore();
  const { theme, setTheme, neo, setNeo } = useTheme();

  const currentPage = ROUTE_LABELS[location.pathname] || "Overview";

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const ThemeIcon = theme === "dark" ? Moon : Sun;

  return (
    <header className="sticky top-0 z-40 h-[60px] lg:h-[72px] w-full border-b border-border/50 bg-background/60 backdrop-blur-md flex items-center justify-between px-4 lg:px-6 shrink-0 transition-all">

      {/* LEFT: Breadcrumb identity */}
      <div className="flex items-center min-w-0 overflow-hidden select-none gap-3">
        <div className="flex items-center gap-2 text-[13px] font-medium">
          {/* <span className="text-muted-foreground/70">Workspace</span> */}
          {/* <ChevronRight size={14} className="text-muted-foreground/40 shrink-0" /> */}
          <span className="text-foreground font-bold lg:font-semibold truncate tracking-tight">{currentPage}</span>
        </div>
      </div>

      {/* CENTER: Global Search */}
      <div className="hidden md:flex flex-1 max-w-xl mx-auto px-6">
        <div className="relative w-full group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 group-focus-within:text-primary transition-colors pointer-events-none">
            <Search size={16} strokeWidth={2.5} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search everything..."
            className="w-full h-9 pl-9 pr-16 text-[13px] font-medium bg-secondary/30 border border-border/60 rounded-md outline-none transition-all focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-muted-foreground/70 hover:text-foreground p-0.5 rounded-md hover:bg-secondary transition-colors"
              >
                <X size={13} strokeWidth={2.5} />
              </button>
            )}
            <div className="hidden sm:flex items-center gap-0.5 text-[10px] font-bold text-muted-foreground/60 bg-secondary/50 px-1.5 py-0.5 rounded border border-border/50 select-none">
              <Command size={10} />
              <span>K</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Global Actions */}
      <div className="flex items-center gap-2 shrink-0">

        {/* Style Mode Toggle */}
        {/* <button
          onClick={() => setNeo(!neo)}
          title={neo ? "Switch to Classic" : "Switch to Neo"}
          className={cn(
            "h-9 w-9 rounded-md flex items-center justify-center transition-all border border-border/60",
            neo
              ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
              : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
          )}
        >
          <Sparkles size={15} className={cn(neo && "fill-primary")} />
        </button> */}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={`Appearance: ${theme}`}
          className="h-9 w-9 rounded-md flex items-center justify-center bg-secondary/50 border border-border/60 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
        >
          <ThemeIcon size={15} />
        </button>

        {/* Separator */}
        <div className="w-[1px] h-4 bg-border/60 mx-1" />

        {/* Quick Add Component */}
        <Button
          onClick={() => openAddDialog()}
          size="sm"
          className="h-9 shadow-sm gap-2"
        >
          <Plus size={15} strokeWidth={2.5} />
          <span className="hidden sm:inline">Quick Add</span>
          <span className="sm:hidden">Add</span>
        </Button>

      </div>
    </header>
  );
}
