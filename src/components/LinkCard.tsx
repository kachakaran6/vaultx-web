import { pushToast } from "../store/toast-store";
import { buildFaviconUrl, getDomain } from "../utils/url";
import type { CategoryRecord, LinkRecord } from "../store/types";
import { cn } from "../utils/cn";

interface LinkCardProps {
  link: LinkRecord;
  category?: CategoryRecord;
  hasReminder: boolean;
  openInExternalBrowser: boolean;
  onFavorite: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onRemind: () => void;
  onRecordVisit: () => void;
  dragHandle?: React.ReactNode;
  dragging?: boolean;
  viewMode?: "list" | "grid" | "table" | "compact";
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
  selectionMode?: boolean;
}

export function LinkCard({
  link,
  category,
  hasReminder,
  openInExternalBrowser,
  onFavorite,
  onEdit,
  onDelete,
  onRemind,
  onRecordVisit,
  dragHandle,
  dragging = false,
  viewMode = "list",
  selected = false,
  onSelect,
  selectionMode = false
}: LinkCardProps) {
  const domain = getDomain(link.url);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(link.url);
      pushToast({
        tone: "success",
        title: "Link copied",
        description: "Copied safely to clipboard."
      });
    } catch {
      pushToast({
        tone: "warning",
        title: "Failed",
        description: "Access denied by browser."
      });
    }
  };

  return (
    <article
      className={cn(
        "bg-surface border border-border transition-all duration-200 group relative overflow-hidden",
        viewMode === "grid" ? "flex flex-col gap-3 p-4 rounded-xl items-start" : "flex items-center gap-4 p-4 rounded-xl",
        viewMode === "compact" && "p-2 gap-3 text-sm",
        (viewMode === "list" || viewMode === "compact") && "hover:border-accent/50 hover:bg-surface-2/30",
        viewMode === "grid" && "hover:border-accent/50 hover:shadow-md",
        dragging && "opacity-50 ring-2 ring-accent/20 shadow-none scale-100 pointer-events-none",
        selected && "ring-1 ring-accent bg-accent/5"
      )}
    >
      {selectionMode && onSelect && (
        <div className={cn("shrink-0", viewMode === "grid" && "absolute top-4 right-4")}>
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => onSelect(e.target.checked)}
            className="w-4 h-4 accent-accent cursor-pointer"
          />
        </div>
      )}
      {category && (
        <div
          className="absolute left-0 top-0 bottom-0 w-[4px] bg-accent/80"
          style={{ backgroundColor: category.color }}
        />
      )}

      {dragHandle && (
        <div className="text-text-faint hover:text-text-muted cursor-grab active:cursor-grabbing transition-colors -ml-2 shrink-0">
          {dragHandle}
        </div>
      )}

      <div className={cn(
        "rounded-lg bg-surface-2 flex items-center justify-center border border-border/50 shrink-0 overflow-hidden",
        viewMode === "compact" ? "w-6 h-6" : "w-10 h-10"
      )}>
        <img
          src={buildFaviconUrl(link.url)}
          alt=""
          className={cn("object-contain", viewMode === "compact" ? "w-3.5 h-3.5" : "w-5 h-5")}
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <a
            href={link.url}
            target={openInExternalBrowser ? "_blank" : "_self"}
            rel="noreferrer"
            onClick={onRecordVisit}
            className="text-base text-text font-semibold tracking-tight truncate group-hover:text-accent transition-colors focus:outline-none focus:underline"
          >
            {link.title}
          </a>
          {hasReminder && (
            <span className="material-symbols-outlined text-[14px] text-accent" style={{ fontVariationSettings: "'FILL' 1" }}>notifications_active</span>
          )}
          {link.isFavorite && (
            <span className="material-symbols-outlined text-[14px] text-danger" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <p className="text-xs font-mono text-text-muted truncate max-w-[200px] sm:max-w-md">{domain}</p>
        </div>
      </div>

      <div className={cn(
        "hidden sm:flex items-center gap-3 shrink-0",
        viewMode === "grid" && "w-full justify-between mt-auto pt-2"
      )}>
        {category && (
           <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-medium bg-surface-2 text-text-muted border border-border/30">
             {category.name}
           </span>
        )}
        <div className="flex items-center gap-1 text-text-faint text-xs justify-end">
          <span className="material-symbols-outlined text-[12px]">visibility</span>
          <span>{link.visitCount} visits</span>
        </div>
      </div>

      <div className={cn(
        "flex items-center opacity-100 transition-opacity bg-surface sm:bg-transparent shrink-0",
        viewMode === "grid" ? "w-full justify-end border-t border-border/50 pt-3 mt-1" : "pl-2"
      )}>
        {link.username && (
          <button
            type="button"
            onClick={async (e) => { 
              e.preventDefault(); 
              await navigator.clipboard.writeText(link.username || "");
              pushToast({ tone: "success", title: "Username copied" });
            }}
            className="p-1.5 rounded-md text-text-muted hover:text-text hover:bg-surface-2 transition-colors"
            title="Copy Username"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </button>
        )}
        {link.password && (
          <button
            type="button"
            onClick={async (e) => { 
              e.preventDefault(); 
              await navigator.clipboard.writeText(link.password || "");
              pushToast({ tone: "success", title: "Password copied" });
            }}
            className="p-1.5 rounded-md text-text-muted hover:text-text hover:bg-surface-2 transition-colors"
            title="Copy Password"
          >
            <span className="material-symbols-outlined text-[18px]">key</span>
          </button>
        )}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); onFavorite(); }}
          className={cn(
            "p-1.5 rounded-md transition-colors",
            link.isFavorite ? "text-danger" : "text-text-muted hover:text-text hover:bg-surface-2"
          )}
          title="Save to Favorites"
        >
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: link.isFavorite ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
        </button>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); onRemind(); }}
          className={cn(
            "p-1.5 rounded-md transition-colors",
            hasReminder ? "text-accent" : "text-text-muted hover:text-text hover:bg-surface-2"
          )}
          title="Set Reminder"
        >
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: hasReminder ? "'FILL' 1" : "'FILL' 0" }}>notifications</span>
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="p-1.5 rounded-md text-text-muted hover:text-text hover:bg-surface-2 transition-colors"
          title="Copy Link"
        >
          <span className="material-symbols-outlined text-[18px]">content_copy</span>
        </button>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); onEdit(); }}
          className="p-1.5 rounded-md text-text-muted hover:text-text hover:bg-surface-2 transition-colors"
          title="Edit Link"
        >
          <span className="material-symbols-outlined text-[18px]">edit</span>
        </button>
        <div className="w-px h-4 bg-border mx-1" />
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); onDelete(); }}
          className="p-1.5 rounded-md text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
          title="Delete Link"
        >
          <span className="material-symbols-outlined text-[18px]">delete</span>
        </button>
      </div>
    </article>
  );
}
