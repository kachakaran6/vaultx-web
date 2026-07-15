import React from "react";
import { LinkRecord } from "../store/types";
import { useAppStore } from "../store/app-store";
import { db } from "../db/schema";
import { pushToast } from "../store/toast-store";
import { buildFaviconUrl } from "../utils/url";

interface KanbanBoardProps {
  links: LinkRecord[];
  onOpenReader: (link: LinkRecord) => void;
}

export function KanbanBoard({ links, onOpenReader }: KanbanBoardProps) {
  const state = useAppStore();

  // Segment links by visit count
  // todo: 0 visits
  // reading: 1-3 visits
  // done: 4+ visits
  const todoLinks = links.filter((l) => l.visitCount === 0);
  const readingLinks = links.filter((l) => l.visitCount > 0 && l.visitCount < 4);
  const doneLinks = links.filter((l) => l.visitCount >= 4);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: "todo" | "reading" | "done") => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (!id) return;

    let targetVisits = 0;
    if (targetStatus === "reading") targetVisits = 1;
    if (targetStatus === "done") targetVisits = 5;

    await db.links.update(id, { visitCount: targetVisits });
    await state.refreshVault();
    
    pushToast({
      tone: "success",
      title: "Reading Status Updated 🍅",
      description: `Moved to ${targetStatus === "todo" ? "To Read" : targetStatus === "reading" ? "In Progress" : "Completed"}.`
    });
  };

  const renderColumn = (
    title: string,
    icon: string,
    colorClass: string,
    columnLinks: LinkRecord[],
    status: "todo" | "reading" | "done"
  ) => {
    return (
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => void handleDrop(e, status)}
        className="flex-1 min-w-[280px] bg-secondary/15 border border-border/60 rounded-xl p-4 flex flex-col h-[65vh] select-none"
      >
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/50">
          <div className="flex items-center gap-2">
            <span className={`material-symbols-outlined text-[18px] ${colorClass}`}>{icon}</span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text">{title}</h4>
          </div>
          <span className="text-[10px] font-bold text-text-muted bg-surface border border-border px-1.5 py-0.5 rounded-full">
            {columnLinks.length}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
          {columnLinks.length === 0 ? (
            <div className="h-28 border border-dashed border-border/65 rounded-lg flex items-center justify-center text-[10px] text-text-faint italic">
              Drag bookmarks here
            </div>
          ) : (
            columnLinks.map((link) => (
              <div
                key={link.id}
                draggable
                onDragStart={(e) => handleDragStart(e, link.id)}
                className="bg-surface border border-border hover:border-accent/40 rounded-lg p-3 shadow-sm hover:shadow transition-all duration-150 cursor-grab active:cursor-grabbing group relative overflow-hidden"
              >
                {link.isPinned && (
                  <div className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-bl" />
                )}
                
                <div className="flex items-start gap-2.5">
                  <img
                    src={link.icon || buildFaviconUrl(link.url)}
                    alt=""
                    className="w-4 h-4 object-contain mt-0.5 shrink-0"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-text leading-snug truncate group-hover:text-accent transition-colors">
                      {link.title}
                    </p>
                    <p className="text-[10px] text-text-muted font-mono truncate mt-0.5">
                      {new URL(link.url).hostname}
                    </p>
                  </div>
                </div>

                {link.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {link.tags.slice(0, 2).map((t) => (
                      <span key={t} className="text-[9px] font-medium text-text-muted bg-secondary/35 px-1 py-0.2 rounded border border-border/40">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/40 text-[9px] text-text-faint">
                  <span>{link.visitCount} visits</span>
                  <button
                    onClick={() => onOpenReader(link)}
                    className="text-text-muted hover:text-accent font-semibold flex items-center gap-0.5"
                  >
                    <span className="material-symbols-outlined text-[10px]">chrome_reader_mode</span>
                    Read
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-4 pt-1">
      {renderColumn("To Read", "inbox", "text-text-muted", todoLinks, "todo")}
      {renderColumn("In Progress", "auto_stories", "text-warning", readingLinks, "reading")}
      {renderColumn("Completed", "verified", "text-success", doneLinks, "done")}
    </div>
  );
}
