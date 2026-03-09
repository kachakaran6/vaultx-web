import { Bell, BellRing, Copy, ExternalLink, GripVertical, Heart, Pencil, Trash2 } from "lucide-react";
import { pushToast } from "../store/toast-store";
import { buildFaviconUrl, getDomain } from "../utils/url";
import type { CategoryRecord, LinkRecord } from "../store/types";

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
        title: "Copied",
        description: "URL copied to clipboard."
      });
    } catch {
      pushToast({
        tone: "warning",
        title: "Copy failed",
        description: "Clipboard access denied."
      });
    }
  };

  return (
    <article
      className={`group relative flex items-center gap-4 rounded-xl border border-vault-border bg-vault-card p-4 transition-all hover:border-vault-primary/40 ${dragging ? "opacity-50 ring-2 ring-vault-primary/20" : ""
        }`}
    >
      <div className="flex items-center gap-3 shrink-0">
        {dragHandle && <div className="text-vault-hint cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity">{dragHandle}</div>}

        <div className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-vault-border bg-vault-surface overflow-hidden">
          <img
            src={buildFaviconUrl(link.url)}
            alt=""
            className="h-6 w-6 object-contain"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col">
          <a
            href={link.url}
            target={openInExternalBrowser ? "_blank" : "_self"}
            rel="noreferrer"
            onClick={onRecordVisit}
            className="truncate text-[15px] font-semibold text-vault-text hover:text-vault-primary transition-colors leading-tight"
          >
            {link.title}
          </a>
          <span className="truncate text-[13px] text-vault-muted mt-0.5">{domain}</span>
        </div>

        <div className="flex items-center gap-3 mt-2">
          <span className="text-[11px] font-medium text-vault-hint">Visited: {link.visitCount}</span>
          {link.tags.length > 0 && (
            <div className="flex gap-1.5">
              {link.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="text-[11px] font-medium text-vault-primary leading-none opacity-80">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={onFavorite}
          className={`p-2 rounded-lg transition-colors ${link.isFavorite ? "text-vault-danger" : "text-vault-muted hover:text-vault-text hover:bg-vault-elevated"
            }`}
          title="Favorite"
        >
          <Heart size={16} fill={link.isFavorite ? "currentColor" : "none"} />
        </button>
        <button
          type="button"
          onClick={onRemind}
          className={`p-2 rounded-lg transition-colors ${hasReminder ? "text-vault-secondary" : "text-vault-muted hover:text-vault-text hover:bg-vault-elevated"
            }`}
          title="Reminder"
        >
          {hasReminder ? <BellRing size={16} /> : <Bell size={16} />}
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="p-2 rounded-lg text-vault-muted hover:text-vault-text hover:bg-vault-elevated transition-colors"
          title="Copy URL"
        >
          <Copy size={16} />
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="p-2 rounded-lg text-vault-muted hover:text-vault-text hover:bg-vault-elevated transition-colors"
          title="Edit"
        >
          <Pencil size={16} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="p-2 rounded-lg text-vault-muted hover:text-vault-danger hover:bg-vault-danger/10 transition-colors"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {category && (
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
          style={{ backgroundColor: category.color }}
        />
      )}
    </article>
  );
}
