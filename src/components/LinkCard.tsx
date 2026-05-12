import { Bell, BellRing, Copy, ExternalLink, GripVertical, Heart, Pencil, Trash2, LinkIcon } from "lucide-react";
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

  const handleCopy = async () => {
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
        "group relative flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-card border border-border rounded-lg shadow-sm transition-all duration-150 hover:border-border/80 hover:shadow-md",
        dragging && "opacity-50 ring-2 ring-primary/20 shadow-none scale-100 pointer-events-none"
      )}
    >
      {category && (
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-lg"
          style={{ backgroundColor: category.color }}
        />
      )}

      <div className="flex-1 flex items-center gap-3 sm:gap-4 min-w-0">
        <div className="flex items-center gap-3 shrink-0 pl-1">
        {dragHandle && (
          <div className="text-muted-foreground opacity-0 group-hover:opacity-60 cursor-grab active:cursor-grabbing transition-opacity -ml-2">
            {dragHandle}
          </div>
        )}

        <div className="relative flex h-10 w-10 items-center justify-center rounded-md bg-secondary/40 border border-border/50 overflow-hidden shadow-sm">
          <img
            src={buildFaviconUrl(link.url)}
            alt=""
            className="h-5 w-5 object-contain grayscale-[0.2] group-hover:grayscale-0 transition-all"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        </div>
      </div>

      <div className="min-w-0 flex-1 py-1">
        <div className="flex items-center gap-2.5 mb-1">
          <a
            href={link.url}
            target={openInExternalBrowser ? "_blank" : "_self"}
            rel="noreferrer"
            onClick={onRecordVisit}
            className="truncate text-[15px] font-semibold text-foreground hover:text-primary transition-colors tracking-tight leading-snug"
          >
            {link.title}
          </a>
          
          {hasReminder && (
            <BellRing size={13} className="text-primary shrink-0" />
          )}
          
          {link.isFavorite && (
            <Heart size={13} className="fill-rose-500 text-rose-500 shrink-0" />
          )}
        </div>

        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-[13px] text-muted-foreground font-medium">
          <span className="truncate opacity-80 flex items-center gap-1"><LinkIcon size={12} /> {domain}</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/40 shrink-0" />
          <span className="tabular-nums opacity-75">{link.visitCount} {link.visitCount === 1 ? 'click' : 'clicks'}</span>
          
          {link.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 ml-1">
              {link.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-[11px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-md border border-primary/5">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-0.5 opacity-100 sm:opacity-0 sm:translate-x-2 sm:group-hover:opacity-100 sm:group-hover:translate-x-0 transition-all duration-200 pt-2 sm:pt-0 border-t border-border/40 sm:border-0 mt-1 sm:mt-0">
        <button
          type="button"
          onClick={onFavorite}
          className={cn(
            "p-2 rounded-md transition-colors hover:bg-secondary",
            link.isFavorite ? "text-rose-500" : "text-muted-foreground hover:text-foreground"
          )}
          title="Save to Favorites"
        >
          <Heart size={16} fill={link.isFavorite ? "currentColor" : "none"} strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={onRemind}
          className={cn(
            "p-2 rounded-md transition-colors hover:bg-secondary",
            hasReminder ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
          title="Set Reminder"
        >
          <Bell size={16} strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          title="Copy Link"
        >
          <Copy size={16} strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          title="Edit Link"
        >
          <Pencil size={16} strokeWidth={2} />
        </button>
        <div className="mx-1 h-5 w-px bg-border/60" />
        <button
          type="button"
          onClick={onDelete}
          className="p-2 rounded-md text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
          title="Delete Link"
        >
          <Trash2 size={16} strokeWidth={2} />
        </button>
      </div>
    </article>
  );
}
