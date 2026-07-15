import { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAppStore } from "../store/app-store";
import { useTheme } from "./ThemeProvider";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { GlobalFooter } from "./GlobalFooter";
import { ChevronDown, Check } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import { CommandPalette } from "./CommandPalette";

const WORKSPACES = [
  { id: "default", name: "Default Space", icon: "space_dashboard" },
  { id: "work", name: "Work Space", icon: "business_center" },
  { id: "personal", name: "Personal Space", icon: "person" }
];

const NAV_ITEMS = [
  { to: "/home", label: "Home", icon: "home" },
  { to: "/categories", label: "Categories", icon: "folder_open" },
  { to: "/stats", label: "Analytics", icon: "insights" },
  { to: "/roadmap", label: "Roadmap", icon: "explore" },
  { to: "/settings", label: "Settings", icon: "settings" }
] as const;

function Sidebar({ isCollapsed, setIsCollapsed }: { isCollapsed: boolean, setIsCollapsed: (val: boolean) => void }) {
  const totalLinks = useAppStore((state) => state.links.length);

  return (
    <aside 
      className={`fixed left-0 top-0 h-full bg-surface border-r border-border flex flex-col z-50 transition-all duration-300 ${
        isCollapsed ? "w-sidebar-collapsed px-2" : "w-sidebar-width px-3"
      } py-4`}
    >
      <div className={`mb-6 flex items-center ${isCollapsed ? "justify-center" : "px-3 gap-3"}`}>
        <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 overflow-hidden border border-border/50 shadow-sm bg-surface p-1">
          <img src="/icons/new-icon.png" alt="Vault X Logo" className="w-full h-full object-contain" />
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden">
            <h1 className="text-base font-semibold text-text leading-none tracking-tight">Vault X</h1>
          </div>
        )}
      </div>
      
      <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            title={isCollapsed ? item.label : undefined}
            className={({ isActive }) => {
              const base = `relative flex items-center h-9 rounded-md transition-all duration-150 cursor-pointer active:scale-[0.98] group ${isCollapsed ? 'justify-center w-9 mx-auto' : 'px-2 gap-3'}`;
              return isActive
                ? `${base} bg-accent-soft text-accent font-medium`
                : `${base} text-text-muted hover:text-text hover:bg-surface-2`;
            }}
          >
            {({ isActive }) => (
              <>
                {isActive && !isCollapsed && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-accent rounded-r-sm" />}
                <span className={`material-symbols-outlined text-[18px] ${isActive ? "text-accent" : "text-text-muted group-hover:text-text"}`}>
                  {item.icon}
                </span>
                {!isCollapsed && <span className="text-sm tracking-tight">{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Mobile App Advertisement */}
      <div className="mt-4 mb-2">
        {!isCollapsed ? (
          <div className="mx-2 p-3 bg-surface border border-border rounded-lg relative group">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="material-symbols-outlined text-[16px] text-accent">smartphone</span>
              <span className="text-xs font-semibold text-text tracking-tight">Vault X Mobile</span>
            </div>
            <p className="text-[10px] text-text-muted mb-3 leading-tight">Access your links on the go.</p>
            <a 
              href="https://play.google.com/store/apps/details?id=com.vaultx.vault_x" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full gap-1.5 text-[11px] font-medium bg-surface-2 text-text py-1.5 rounded border border-border hover:bg-surface hover:text-accent hover:border-accent/50 transition-all shadow-sm active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[14px]">shop</span>
              Get on Play Store
            </a>
          </div>
        ) : (
          <a
            href="https://play.google.com/store/apps/details?id=com.vaultx.vault_x"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto w-8 h-8 flex items-center justify-center rounded-md bg-surface border border-border text-text-muted hover:text-accent hover:bg-accent-soft transition-all active:scale-[0.95]"
            title="Get Vault X Mobile"
          >
            <span className="material-symbols-outlined text-[18px]">smartphone</span>
          </a>
        )}
      </div>
      
      <footer className="mt-auto space-y-2 border-t border-border pt-4">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-2 gap-2 group cursor-pointer hover:bg-surface-2 py-1.5 rounded-md transition-colors'}`}>
          <Avatar className="w-7 h-7 rounded border border-border">
            <AvatarFallback className="bg-surface-2 text-text-muted text-xs rounded">VU</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <p className="text-xs font-medium truncate text-text transition-colors">Vault User</p>
              <p className="text-[10px] text-text-faint truncate">{totalLinks} links</p>
            </div>
          )}
        </div>

        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`h-8 w-full flex items-center text-text-muted hover:text-text transition-colors rounded-md hover:bg-surface-2 ${isCollapsed ? 'justify-center' : 'px-2 gap-2'}`}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <span className="material-symbols-outlined text-[18px]">{isCollapsed ? "chevron_right" : "chevron_left"}</span>
          {!isCollapsed && <span className="text-xs font-medium">Collapse</span>}
        </button>
      </footer>
    </aside>
  );
}

export function AppShell() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const searchQuery = useAppStore((state) => state.searchQuery);
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);
  const openAddDialog = useAppStore((state) => state.openAddDialog);
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const activeWorkspaceId = useAppStore((state) => state.settings.activeWorkspaceId || "default");
  const updateSetting = useAppStore((state) => state.updateSetting);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith("/home")) return "Home";
    if (path.startsWith("/categories")) return "Categories";
    if (path.startsWith("/boards")) return "Mood Boards";
    if (path.startsWith("/stats")) return "Analytics";
    if (path.startsWith("/roadmap")) return "Roadmap";
    if (path.startsWith("/settings")) return "Settings";
    return "Dashboard";
  };

  return (
    <div className="flex bg-bg text-text overflow-hidden h-screen w-full selection:bg-accent-soft selection:text-accent font-sans">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <main 
        className="flex-1 flex flex-col h-full bg-bg overflow-hidden relative transition-all duration-300"
        style={{ marginLeft: isCollapsed ? '64px' : '220px' }}
      >
        <header 
          className="fixed top-0 right-0 h-14 bg-surface/80 backdrop-blur-md border-b border-border z-40 flex justify-between items-center px-6 transition-all duration-300"
          style={{ width: `calc(100% - ${isCollapsed ? '64px' : '220px'})` }}
        >
          <div className="flex items-center gap-2 text-sm font-medium text-text-muted shrink-0">
            <span className="hover:text-text cursor-pointer transition-colors">Vault X</span>
            <span className="opacity-40">/</span>
            <span className="text-text font-semibold mr-2">{getPageTitle()}</span>
            
            <span className="opacity-40">/</span>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 px-2 py-0.5 rounded border border-border bg-surface text-xs font-semibold text-text hover:bg-surface-2 transition-colors">
                <span className="material-symbols-outlined text-[14px]">
                  {WORKSPACES.find(w => w.id === activeWorkspaceId)?.icon || "space_dashboard"}
                </span>
                <span>{WORKSPACES.find(w => w.id === activeWorkspaceId)?.name}</span>
                <ChevronDown size={11} className="text-text-muted shrink-0 ml-0.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[180px]">
                {WORKSPACES.map((w) => (
                  <DropdownMenuItem
                    key={w.id}
                    onClick={() => void updateSetting("activeWorkspaceId", w.id)}
                    className="cursor-pointer flex items-center gap-2 h-9"
                  >
                    <span className="material-symbols-outlined text-[16px] text-text-muted">{w.icon}</span>
                    <span className="font-semibold text-[13px] text-text">{w.name}</span>
                    {activeWorkspaceId === w.id && (
                      <Check size={14} className="ml-auto text-success shrink-0" strokeWidth={3} />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-4 flex-1 justify-end max-w-sm ml-4">
            <div className="relative w-full focus-within:ring-2 focus-within:ring-accent-soft focus-within:border-accent rounded-md overflow-hidden flex items-center bg-surface border border-border px-3 h-8 transition-all duration-150 shadow-sm">
              <span className="material-symbols-outlined text-text-faint text-[16px]">search</span>
              <input 
                className="bg-transparent border-none focus:ring-0 text-xs w-full placeholder:text-text-faint outline-none pl-2 h-full" 
                placeholder="Search..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:bg-surface-2 hover:text-text transition-colors shrink-0"
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <span className="material-symbols-outlined text-[18px]">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
          </div>
        </header>

        <div className={`mt-14 custom-scrollbar w-full ${location.pathname.match(/^\/boards\/[a-zA-Z0-9-]+$/) ? 'h-[calc(100vh-56px)] overflow-hidden' : 'h-[calc(100vh-56px)] overflow-y-auto flex flex-col'}`}>
          <div className={`flex-1 flex flex-col ${location.pathname.match(/^\/boards\/[a-zA-Z0-9-]+$/) ? '' : 'px-6 pt-6 pb-24'}`}>
            <Outlet />
          </div>
          {!location.pathname.match(/^\/boards\/[a-zA-Z0-9-]+$/) && <GlobalFooter />}
        </div>

      </main>

      <CommandPalette 
        open={showCommandPalette} 
        onClose={() => setShowCommandPalette(false)} 
      />
    </div>
  );
}
