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
  dragging = false
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
        "flex items-center gap-4 p-4 bg-surface border border-border rounded-xl hover:border-accent/50 hover:bg-surface-2/30 transition-all duration-200 group relative overflow-hidden",
        dragging && "opacity-50 ring-2 ring-accent/20 shadow-none scale-100 pointer-events-none"
      )}
    >
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

      <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center border border-border/50 shrink-0 overflow-hidden">
        <img
          src={buildFaviconUrl(link.url)}
          alt=""
          className="w-5 h-5 object-contain"
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

      <div className="hidden sm:flex items-center gap-3 shrink-0">
        {category && (
           <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-medium bg-surface-2 text-text-muted border border-border/30">
             {category.name}
           </span>
        )}
        <div className="flex items-center gap-1 text-text-faint text-xs w-20 justify-end">
          <span className="material-symbols-outlined text-[12px]">visibility</span>
          <span>{link.visitCount} visits</span>
        </div>
      </div>

      <div className="flex items-center opacity-100 transition-opacity bg-surface sm:bg-transparent pl-2 shrink-0">
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
