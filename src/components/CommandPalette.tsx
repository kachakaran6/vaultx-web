import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/app-store";
import { useTheme } from "./ThemeProvider";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

const COMMANDS = [
  { id: "add-link", name: "Quick Add Link", category: "Actions", icon: "add_link" },
  { id: "add-cat", name: "Create Collection / Folder", category: "Actions", icon: "create_new_folder" },
  { id: "theme", name: "Toggle Theme (Light / Dark)", category: "Settings", icon: "dark_mode" },
  { id: "view-list", name: "Set View to List Layout", category: "Layout", icon: "view_list" },
  { id: "view-grid", name: "Set View to Grid Layout", category: "Layout", icon: "grid_view" },
  { id: "view-table", name: "Set View to Table Layout", category: "Layout", icon: "table_rows" },
  { id: "go-home", name: "Go to Home Screen", category: "Navigation", icon: "home" },
  { id: "go-stats", name: "Go to Analytics & Stats", category: "Navigation", icon: "insights" },
  { id: "go-settings", name: "Go to Settings", category: "Navigation", icon: "settings" },
  { id: "space-default", name: "Switch to Default Workspace", category: "Workspace", icon: "space_dashboard" },
  { id: "space-work", name: "Switch to Work Workspace", category: "Workspace", icon: "business_center" },
  { id: "space-personal", name: "Switch to Personal Workspace", category: "Workspace", icon: "person" }
];

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const state = useAppStore();
  const { theme, setTheme } = useTheme();

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter commands and links based on search query
  const filteredItems = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    
    // 1. Matches from static commands
    const matchesCommands = COMMANDS.filter(cmd => 
      cmd.name.toLowerCase().includes(q) || cmd.category.toLowerCase().includes(q)
    ).map(cmd => ({
      ...cmd,
      type: "command" as const
    }));

    // 2. Matches from actual bookmark links
    const matchesLinks = state.links.filter(link => 
      link.title.toLowerCase().includes(q) || link.url.toLowerCase().includes(q)
    ).slice(0, 5).map(link => ({
      id: `link-${link.id}`,
      name: link.title,
      category: "Saved Bookmarks",
      icon: "link",
      type: "link" as const,
      url: link.url,
      linkId: link.id
    }));

    return [...matchesCommands, ...matchesLinks];
  }, [query, state.links]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Handle keyboard shortcuts inside palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredItems.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          handleExecuteItem(filteredItems[selectedIndex]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, filteredItems, selectedIndex]);

  const handleExecuteItem = (item: typeof filteredItems[0]) => {
    if (item.type === "link") {
      state.recordVisit(item.linkId!);
      window.open(item.url, "_blank");
      onClose();
      return;
    }

    // Static Command Handlers
    switch (item.id) {
      case "add-link":
        state.openAddDialog();
        break;
      case "add-cat":
        state.openCategoryDialog();
        break;
      case "theme":
        setTheme(theme === "dark" ? "light" : "dark");
        break;
      case "view-list":
        state.updateSetting("viewMode", "list");
        break;
      case "view-grid":
        state.updateSetting("viewMode", "grid");
        break;
      case "view-table":
        state.updateSetting("viewMode", "table");
        break;
      case "go-home":
        navigate("/home");
        break;
      case "go-stats":
        navigate("/stats");
        break;
      case "go-settings":
        navigate("/settings");
        break;
      case "space-default":
        state.updateSetting("activeWorkspaceId", "default");
        break;
      case "space-work":
        state.updateSetting("activeWorkspaceId", "work");
        break;
      case "space-personal":
        state.updateSetting("activeWorkspaceId", "personal");
        break;
    }
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Palette Container */}
      <div className="bg-surface border border-border/80 w-full max-w-xl rounded-xl shadow-2xl overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50 bg-secondary/10 shrink-0">
          <span className="material-symbols-outlined text-[20px] text-text-muted shrink-0">search</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or bookmark name..."
            className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-text-faint text-text h-6"
          />
          <span className="text-[10px] font-bold text-text-faint bg-surface-2 px-1.5 py-0.5 rounded border border-border select-none">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-[350px] overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-text-muted">
              No matching commands or bookmarks found.
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleExecuteItem(item)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors duration-150 ${
                    isSelected ? "bg-accent-soft text-accent" : "hover:bg-surface-2/60 text-text"
                  }`}
                >
                  <span className={`material-symbols-outlined text-[18px] shrink-0 ${
                    isSelected ? "text-accent" : "text-text-muted"
                  }`}>
                    {item.icon}
                  </span>
                  <span className="text-xs font-semibold truncate flex-1 leading-none">{item.name}</span>
                  <span className={`text-[10px] uppercase font-bold tracking-wider shrink-0 ${
                    isSelected ? "text-accent/80" : "text-text-faint"
                  }`}>
                    {item.category}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Command Helper Footer */}
        <div className="px-4 py-2 bg-secondary/20 border-t border-border/40 text-[10px] text-text-muted flex justify-between shrink-0">
          <div className="flex gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <span>Command Palette</span>
        </div>
      </div>
    </div>
  );
}
