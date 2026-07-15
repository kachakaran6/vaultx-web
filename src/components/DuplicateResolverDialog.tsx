import React, { useState, useMemo } from "react";
import { ModalShell } from "./ModalShell";
import { useAppStore } from "../store/app-store";
import { db } from "../db/schema";
import { LinkRecord } from "../store/types";
import { pushToast } from "../store/toast-store";
import { Button } from "./ui/button";

interface DuplicateResolverDialogProps {
  open: boolean;
  onClose: () => void;
}

interface DuplicateGroup {
  id: string;
  type: "url" | "title";
  key: string;
  links: LinkRecord[];
}

export function DuplicateResolverDialog({ open, onClose }: DuplicateResolverDialogProps) {
  const state = useAppStore();
  const [resolving, setResolving] = useState(false);

  // Group links by normalizedUrl or title
  const duplicateGroups = useMemo(() => {
    const groups: DuplicateGroup[] = [];

    // 1. Group by normalizedUrl
    const urlMap = new Map<string, LinkRecord[]>();
    state.links.forEach((link) => {
      const list = urlMap.get(link.normalizedUrl) || [];
      list.push(link);
      urlMap.set(link.normalizedUrl, list);
    });

    urlMap.forEach((links, url) => {
      if (links.length > 1) {
        groups.push({
          id: `url-${url}`,
          type: "url",
          key: url,
          links: [...links].sort((a, b) => a.createdAt - b.createdAt) // oldest first
        });
      }
    });

    // 2. Group by title (case-insensitive) for links that don't share the same URL
    const titleMap = new Map<string, LinkRecord[]>();
    state.links.forEach((link) => {
      const cleanTitle = link.title.trim().toLowerCase();
      if (cleanTitle.length > 3) {
        const list = titleMap.get(cleanTitle) || [];
        list.push(link);
        titleMap.set(cleanTitle, list);
      }
    });

    titleMap.forEach((links, title) => {
      if (links.length > 1) {
        // filter out matches that are already in the same URL group
        const uniqueUrls = new Set(links.map((l) => l.normalizedUrl));
        if (uniqueUrls.size > 1) {
          // Check if this group is already covered by URL groups
          const alreadyCovered = groups.some(g => 
            g.type === "url" && links.every(l => l.normalizedUrl === g.key)
          );
          if (!alreadyCovered) {
            groups.push({
              id: `title-${title}`,
              type: "title",
              key: title,
              links: [...links].sort((a, b) => a.createdAt - b.createdAt) // oldest first
            });
          }
        }
      }
    });

    return groups;
  }, [state.links]);

  const handleResolveGroup = async (group: DuplicateGroup, action: "merge" | "keep_oldest" | "keep_newest" | "delete_all", masterLinkId?: string) => {
    setResolving(true);
    try {
      const linkIds = group.links.map(l => l.id);
      
      if (action === "delete_all") {
        await db.transaction("rw", db.links, db.reminders, async () => {
          await db.links.bulkDelete(linkIds);
          await db.reminders.where("linkId").anyOf(linkIds).delete();
        });
        pushToast({ tone: "danger", title: "Duplicates deleted", description: `Removed ${linkIds.length} bookmarks.` });
      } else if (action === "keep_oldest" || action === "keep_newest") {
        const keepIndex = action === "keep_oldest" ? 0 : group.links.length - 1;
        const keepLink = group.links[keepIndex];
        const deleteIds = linkIds.filter(id => id !== keepLink.id);
        
        await db.transaction("rw", db.links, db.reminders, async () => {
          await db.links.bulkDelete(deleteIds);
          await db.reminders.where("linkId").anyOf(deleteIds).delete();
        });
        pushToast({ tone: "success", title: "Resolved duplicate", description: `Kept: "${keepLink.title}"` });
      } else if (action === "merge") {
        const masterId = masterLinkId || group.links[0].id;
        const masterLink = group.links.find(l => l.id === masterId) || group.links[0];
        const secondaryLinks = group.links.filter(l => l.id !== masterId);
        
        // Merge tags, notes, and visits
        let mergedTags = [...masterLink.tags];
        let mergedNotes = masterLink.notes.trim();
        let totalVisits = masterLink.visitCount;
        
        secondaryLinks.forEach(l => {
          mergedTags = [...mergedTags, ...l.tags];
          if (l.notes.trim() && !mergedNotes.includes(l.notes.trim())) {
            mergedNotes = mergedNotes ? `${mergedNotes}\n${l.notes.trim()}` : l.notes.trim();
          }
          totalVisits += l.visitCount;
        });

        // Deduplicate tags
        const finalTags = Array.from(new Set(mergedTags.map(t => t.trim().toLowerCase())))
          .map(t => {
            const original = mergedTags.find(ot => ot.toLowerCase() === t);
            return original || t;
          });

        await db.transaction("rw", db.links, db.reminders, async () => {
          // Update master
          await db.links.update(masterId, {
            tags: finalTags,
            notes: mergedNotes,
            visitCount: totalVisits,
            lastVisited: Math.max(masterLink.lastVisited || 0, ...secondaryLinks.map(l => l.lastVisited || 0)) || null
          });
          // Delete secondary
          const deleteIds = secondaryLinks.map(l => l.id);
          await db.links.bulkDelete(deleteIds);
          await db.reminders.where("linkId").anyOf(deleteIds).delete();
        });

        pushToast({ tone: "success", title: "Links merged", description: `Merged metadata into "${masterLink.title}"` });
      }
      
      await state.refreshVault();
    } catch (e) {
      pushToast({ tone: "danger", title: "Resolution failed", description: "An error occurred while merging." });
    } finally {
      setResolving(false);
    }
  };

  const handleResolveAll = async (action: "keep_oldest" | "keep_newest") => {
    setResolving(true);
    try {
      let count = 0;
      await db.transaction("rw", db.links, db.reminders, async () => {
        for (const group of duplicateGroups) {
          const keepIndex = action === "keep_oldest" ? 0 : group.links.length - 1;
          const keepLink = group.links[keepIndex];
          const deleteIds = group.links.map(l => l.id).filter(id => id !== keepLink.id);
          
          await db.links.bulkDelete(deleteIds);
          await db.reminders.where("linkId").anyOf(deleteIds).delete();
          count += deleteIds.length;
        }
      });
      pushToast({ tone: "success", title: "Bulk resolve complete", description: `Safely removed ${count} duplicates.` });
      await state.refreshVault();
    } catch (e) {
      pushToast({ tone: "danger", title: "Bulk resolution failed" });
    } finally {
      setResolving(false);
    }
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Duplicate Resolver"
      widthClassName="max-w-2xl"
      footer={
        <div className="flex justify-between w-full">
          {duplicateGroups.length > 0 ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={resolving}
                onClick={() => handleResolveAll("keep_oldest")}
              >
                Keep All Oldest
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={resolving}
                onClick={() => handleResolveAll("keep_newest")}
              >
                Keep All Newest
              </Button>
            </div>
          ) : <div />}
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {duplicateGroups.length === 0 ? (
          <div className="py-10 text-center space-y-3">
            <span className="material-symbols-outlined text-[48px] text-success">check_circle</span>
            <h3 className="text-base font-bold text-text">No duplicates found</h3>
            <p className="text-xs text-text-muted max-w-xs mx-auto">
              Your vault is clean! All saved bookmarks have unique URLs and titles.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-accent-soft rounded-lg border border-accent/20">
              <p className="text-xs text-text font-medium leading-relaxed">
                Found <strong>{duplicateGroups.length}</strong> groups of duplicate bookmarks. Choose whether to merge their metadata (tags, notes, visits) or delete the redundant entries.
              </p>
            </div>

            <div className="space-y-3 divide-y divide-border/40 max-h-[50vh] overflow-y-auto pr-1">
              {duplicateGroups.map((group, index) => (
                <div key={group.id} className={`pt-4 ${index === 0 ? "pt-0" : ""}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">
                        {group.type === "url" ? "link" : "title"}
                      </span>
                      {group.type === "url" ? "Same URL address" : "Same Title"}
                    </span>
                    <span className="text-[10px] bg-surface-2 px-2 py-0.5 rounded font-semibold text-text-muted">
                      {group.links.length} copies
                    </span>
                  </div>

                  <div className="space-y-2 bg-surface-2/40 border border-border/50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-text truncate">
                      {group.links[0].title}
                    </p>
                    <p className="text-[10px] text-text-faint font-mono truncate">
                      {group.links[0].url}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2 justify-end pt-2 border-t border-border/40">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-[11px]"
                        disabled={resolving}
                        onClick={() => handleResolveGroup(group, "merge")}
                      >
                        Merge Tags & Info
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-[11px]"
                        disabled={resolving}
                        onClick={() => handleResolveGroup(group, "keep_oldest")}
                      >
                        Keep Oldest
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-[11px]"
                        disabled={resolving}
                        onClick={() => handleResolveGroup(group, "keep_newest")}
                      >
                        Keep Newest
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-7 text-[11px]"
                        disabled={resolving}
                        onClick={() => handleResolveGroup(group, "delete_all")}
                      >
                        Delete All
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ModalShell>
  );
}
