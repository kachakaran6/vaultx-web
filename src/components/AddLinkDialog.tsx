import React, { useEffect, useMemo, useState } from "react";
import { ModalShell } from "./ModalShell";
import { useAppStore } from "../store/app-store";
import { getDomain, isValidHttpUrl } from "../utils/url";
import { fetchLinkMetadata } from "../utils/metadata";
import { Loader2 } from "lucide-react";

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

  return (
    <ModalShell
      open={open}
      onClose={closeAddDialog}
      title={existingLink ? "Edit Link" : "Add to Vault"}
      footer={
        <>
          <button
            type="button"
            onClick={closeAddDialog}
            className="px-4 py-2 rounded-xl text-sm font-bold text-vault-muted hover:text-vault-text transition-colors"
          >
            Cancel
          </button>
          <button
            form="vault-link-form"
            type="submit"
            disabled={saving}
            className="px-6 py-2 rounded-xl bg-vault-primary text-sm font-bold text-white shadow-subtle transition hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving..." : existingLink ? "Update Link" : "Save to Vault"}
          </button>
        </>
      }
    >
      <form id="vault-link-form" className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-vault-muted uppercase tracking-wider">URL</label>
              {fetching && (
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-vault-primary uppercase tracking-widest animate-pulse">
                  <Loader2 size={12} className="animate-spin" />
                  Fetching Details
                </div>
              )}
            </div>
            <input
              required
              autoFocus
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://"
              className="w-full h-11 px-4 rounded-xl border border-vault-border bg-vault-card text-sm text-vault-text outline-none focus:border-vault-primary/50 transition-all placeholder:text-vault-muted/40"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-vault-muted uppercase tracking-wider">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Link title"
              list="vault-title-history"
              className="w-full h-11 px-4 rounded-xl border border-vault-border bg-vault-card text-sm text-vault-text outline-none focus:border-vault-primary/50 transition-all placeholder:text-vault-muted/40"
            />
            <datalist id="vault-title-history">
              {settings.titleHistory.map((entry) => (
                <option key={entry} value={entry} />
              ))}
            </datalist>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-bold text-vault-muted uppercase tracking-wider">Tags</label>
              <input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="design, productivity, news"
                className="w-full h-11 px-4 rounded-xl border border-vault-border bg-vault-card text-sm text-vault-text outline-none focus:border-vault-primary/50 transition-all placeholder:text-vault-muted/40"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-vault-muted uppercase tracking-wider">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-vault-border bg-vault-card text-sm text-vault-text outline-none focus:border-vault-primary/50 transition-all cursor-pointer"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-vault-muted uppercase tracking-wider">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Any notes about this link..."
              className="w-full p-4 rounded-xl border border-vault-border bg-vault-card text-sm text-vault-text outline-none focus:border-vault-primary/50 transition-all placeholder:text-vault-muted/40 resize-none"
            />
          </div>

          <label className="flex items-center justify-between p-4 rounded-xl border border-vault-border bg-vault-card group transition-colors hover:border-vault-primary/30 cursor-pointer">
            <div className="space-y-1">
              <p className="text-sm font-bold text-vault-text">Favorite</p>
              <p className="text-xs text-vault-muted">Add to quick access collection</p>
            </div>
            <input
              type="checkbox"
              checked={isFavorite}
              onChange={(e) => setIsFavorite(e.target.checked)}
              className="h-5 w-5 rounded border-vault-border bg-vault-elevated text-vault-primary focus:ring-offset-vault-background"
            />
          </label>
        </div>
      </form>
    </ModalShell>
  );
}
