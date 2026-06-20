import React, { useEffect, useMemo, useState } from "react";
import { ModalShell } from "./ModalShell";
import { useAppStore } from "../store/app-store";
import { getDomain, isValidHttpUrl } from "../utils/url";
import { fetchLinkMetadata } from "../utils/metadata";
import { Loader2, Check } from "lucide-react";
import { cn } from "../utils/cn";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";

export function AddLinkDialog() {
  const open = useAppStore((state) => state.isAddDialogOpen);
  const addDialogLinkId = useAppStore((state) => state.addDialogLinkId);
  const addDialogPresetUrl = useAppStore((state) => state.addDialogPresetUrl);
  const closeAddDialog = useAppStore((state) => state.closeAddDialog);
  const saveLink = useAppStore((state) => state.saveLink);
  const categories = useAppStore((state) => state.categories);
  const links = useAppStore((state) => state.links);
  const settings = useAppStore((state) => state.settings);

  const existingLink = useMemo(
    () => links.find((link) => link.id === addDialogLinkId) ?? null,
    [links, addDialogLinkId]
  );

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [categoryId, setCategoryId] = useState("general");
  const [tagsInput, setTagsInput] = useState("");
  const [notes, setNotes] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (existingLink) {
      setTitle(existingLink.title);
      setUrl(existingLink.url);
      setCategoryId(existingLink.categoryId);
      setTagsInput(existingLink.tags.join(", "));
      setNotes(existingLink.notes);
      setIsFavorite(existingLink.isFavorite);
      return;
    }

    setTitle(addDialogPresetUrl ? getDomain(addDialogPresetUrl) : "");
    setUrl(addDialogPresetUrl);
    setCategoryId(categories.find((c) => c.id === "general")?.id ?? categories[0]?.id ?? "general");
    setTagsInput("");
    setNotes("");
    setIsFavorite(false);
  }, [open, addDialogLinkId, addDialogPresetUrl, existingLink, categories]);

  useEffect(() => {
    if (!url || !isValidHttpUrl(url) || existingLink || title) {
      return;
    }

    const timer = setTimeout(async () => {
      setFetching(true);
      const meta = await fetchLinkMetadata(url);
      setFetching(false);

      if (meta?.title && !title) {
        setTitle(meta.title);
      }
      if (meta?.description && !notes) {
        setNotes(meta.description);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [url, existingLink, title, notes]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    const result = await saveLink({
      id: existingLink?.id,
      title,
      url,
      categoryId,
      tags: tagsInput.split(","),
      notes,
      isFavorite
    });
    setSaving(false);
    if (result.ok) {
      closeAddDialog();
    }
  };

  const inputBase = "w-full h-9 px-3 rounded-md border border-border bg-surface text-sm text-text outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-text-faint font-medium shadow-sm";

  return (
    <ModalShell
      open={open}
      onClose={closeAddDialog}
      title={existingLink ? "Edit item" : "Save new item"}
      footer={
        <>
          <button
            type="button"
            onClick={closeAddDialog}
            className="h-10 px-4 rounded-md text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors hover:bg-secondary"
          >
            Cancel
          </button>
          <button
            form="vault-link-form"
            type="submit"
            disabled={saving}
            className="h-9 px-4 rounded-md bg-accent text-surface text-sm font-semibold transition-all hover:brightness-110 disabled:opacity-50 shadow-sm"
          >
            {saving ? "Saving..." : "Confirm"}
          </button>
        </>
      }
    >
      <form id="vault-link-form" className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-text uppercase tracking-wider">URL address</label>
              {fetching && (
                <div className="flex items-center gap-1.5 text-xs font-medium text-accent animate-pulse">
                  <Loader2 size={12} className="animate-spin" />
                  Fetching...
                </div>
              )}
            </div>
            <input
              required
              autoFocus
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className={inputBase}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text uppercase tracking-wider">Display title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Label for this bookmark"
              list="vault-title-history"
              className={inputBase}
            />
            <datalist id="vault-title-history">
              {settings.titleHistory.map((entry) => (
                <option key={entry} value={entry} />
              ))}
            </datalist>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text uppercase tracking-wider">Tags (comma separated)</label>
              <input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. read, tool"
                className={inputBase}
              />
            </div>

            <div className="space-y-1.5 flex flex-col">
              <label className="text-xs font-semibold text-text uppercase tracking-wider">Collection</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      inputBase, 
                      "flex items-center justify-between text-left cursor-pointer bg-secondary/40 dark:bg-secondary/20"
                    )}
                  >
                    <span className="flex items-center gap-2 text-text">
                      <span>{categories.find(c => c.id === categoryId)?.icon}</span>
                      <span>{categories.find(c => c.id === categoryId)?.name}</span>
                    </span>
                    <span className="material-symbols-outlined text-[16px] text-text-faint">expand_more</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[calc(50vw-2rem)] sm:w-[220px]">
                  {categories.map((category) => (
                    <DropdownMenuItem 
                      key={category.id} 
                      onClick={() => setCategoryId(category.id)}
                      className="cursor-pointer flex items-center gap-2 h-9"
                    >
                      <span className="text-[16px]">{category.icon}</span>
                      <span className="font-medium text-[13px]">{category.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text uppercase tracking-wider">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Write a brief note here..."
              className={cn(inputBase, "h-auto py-3 resize-none")}
            />
          </div>

          <label className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/20 transition-colors cursor-pointer hover:bg-secondary/40 select-none">
            <div className="space-y-0.5">
              <p className="text-[14px] font-semibold text-foreground">Mark as favorite</p>
              <p className="text-[12px] font-medium text-muted-foreground">Easily access this item later</p>
            </div>
            <div className={cn(
              "w-5 h-5 rounded border transition-all flex items-center justify-center",
              isFavorite ? "bg-accent border-accent text-surface" : "border-border bg-surface"
            )}>
              {isFavorite && <Check size={14} strokeWidth={3} />}
            </div>
            <input
              type="checkbox"
              checked={isFavorite}
              onChange={(e) => setIsFavorite(e.target.checked)}
              className="sr-only"
            />
          </label>
        </div>
      </form>
    </ModalShell>
  );
}
