import { NavLink, Outlet } from "react-router-dom";
import { BarChart3, FolderKanban, Home, Settings } from "lucide-react";
import { useAppStore } from "../store/app-store";

const NAV_ITEMS = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/categories", label: "Categories", icon: FolderKanban },
  { to: "/stats", label: "Stats", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings }
] as const;

function Sidebar() {
  const totalLinks = useAppStore((state) => state.links.length);

  return (
    <div className="flex h-full flex-col bg-vault-surface border-r border-vault-border">
      <div className="p-6">
        <div className="flex items-center gap-2">
          {/* <div className="h-8 w-8 rounded-lg bg-vault-primary flex items-center justify-center font-bold text-white text-lg">
            V
          </div> */}
          <div>
            <h1 className="font-display text-lg font-bold tracking-tight text-vault-text">Vault X</h1>
            <p className="text-[11px] font-medium text-vault-muted uppercase tracking-wider">{totalLinks} links stored</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-[14px] font-medium transition-all rounded-xl ${isActive
                  ? "bg-vault-elevated text-vault-primary border border-vault-border"
                  : "text-vault-muted hover:text-vault-text hover:bg-vault-elevated/50"
                }`
              }
            >
              <Icon size={18} />
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
    <div className="flex min-h-screen bg-vault-background text-vault-text">
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[240px] self-start lg:block shrink-0">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 px-4 py-8 lg:px-10 max-w-6xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Mobile Navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-vault-border bg-vault-card/95 py-3 px-6 lg:hidden backdrop-blur-md">
        <div className="flex justify-between items-center">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 text-[11px] font-medium transition ${isActive ? "text-vault-primary" : "text-vault-muted"
                  }`
                }
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
