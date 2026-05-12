import { NavLink, Outlet } from "react-router-dom";
import { BarChart3, FolderKanban, Home, Settings, Command } from "lucide-react";
import { useAppStore } from "../store/app-store";
import { GlobalHeader } from "./GlobalHeader";


const NAV_ITEMS = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/categories", label: "Categories", icon: FolderKanban },
  { to: "/stats", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings }
] as const;

function Sidebar() {
  const totalLinks = useAppStore((state) => state.links.length);

  return (
    <div className="flex h-full flex-col bg-card border-r border-border/60 shadow-sm">
      {/* Logo Area - More compact and elegant */}
      <div className="px-2 py-4">
        <div className="flex items-center gap-3">
          {/* <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white shrink-0">
            <Command size={18} strokeWidth={2.5} />
          </div> */}
          <div>
            <h1 className="text-[18px] font-bold tracking-tight text-foreground leading-none">Vault X</h1>
            <p className="text-[11px] font-medium text-muted-foreground mt-1">{totalLinks} saved</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-0 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => {
                const base = "flex items-center gap-3 px-3 h-10 text-[14px] font-medium transition-all duration-200 rounded-md group select-none";
                return isActive
                  ? `${base} bg-primary/10 text-primary`
                  : `${base} text-muted-foreground hover:text-foreground hover:bg-secondary`;
              }}
            >
              <Icon size={18} strokeWidth={2} className="shrink-0 opacity-80 group-hover:opacity-100" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

export function AppShell() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[180px] self-start lg:block shrink-0">
        <Sidebar />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <GlobalHeader />
        <main className="flex-1 w-full">
          <div className="max-w-[1280px] w-full pt-6 px-4 sm:px-6 lg:px-8 pb-20">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Navigation with Safe Area Support */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom,12px))] px-6 lg:hidden backdrop-blur-md shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
        <div className="flex justify-around items-center">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 text-[11px] font-medium transition-all duration-200 ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`
                }
              >
                <Icon size={20} strokeWidth={2} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
