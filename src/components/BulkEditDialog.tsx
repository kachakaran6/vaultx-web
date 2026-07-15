import React, { useState } from "react";
import { ModalShell } from "./ModalShell";
import { useAppStore } from "../store/app-store";
import { cn } from "../utils/cn";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";

interface BulkEditDialogProps {
  open: boolean;
  onClose: () => void;
  selectedIds: Set<string>;
  onSuccess: () => void;
}

export function BulkEditDialog({ open, onClose, selectedIds, onSuccess }: BulkEditDialogProps) {
  const categories = useAppStore((state) => state.categories);
  const bulkUpdateLinksMetadata = useAppStore((state) => state.bulkUpdateLinksMetadata);
  
  const [categoryId, setCategoryId] = useState<string>("no-change");
  const [addTagsInput, setAddTagsInput] = useState("");
  const [removeTagsInput, setRemoveTagsInput] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const addTags = addTagsInput.split(",").map(t => t.trim()).filter(Boolean);
    const removeTags = removeTagsInput.split(",").map(t => t.trim()).filter(Boolean);

    await bulkUpdateLinksMetadata(Array.from(selectedIds), {
      categoryId: categoryId === "no-change" ? undefined : categoryId,
      addTags,
      removeTags,
    });

    setSaving(false);
    // Reset inputs
    setCategoryId("no-change");
    setAddTagsInput("");
    setRemoveTagsInput("");
    onSuccess();
    onClose();
  };

  const inputBase = "w-full h-9 px-3 rounded-md border border-border bg-surface text-sm text-text outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-text-faint font-medium shadow-sm";

  const selectedCategory = categoryId === "no-change"
    ? { icon: "➖", name: "No change" }
    : categories.find(c => c.id === categoryId) || { icon: "📌", name: "General" };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={`Bulk Edit Metadata (${selectedIds.size} items)`}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-4 rounded-md text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors hover:bg-secondary"
          >
            Cancel
          </button>
          <button
            form="vault-bulk-edit-form"
            type="submit"
            disabled={saving || (categoryId === "no-change" && !addTagsInput && !removeTagsInput)}
            className="h-9 px-4 rounded-md bg-accent text-surface text-sm font-semibold transition-all hover:brightness-110 disabled:opacity-50 shadow-sm cursor-pointer"
          >
            {saving ? "Applying..." : "Apply Changes"}
          </button>
        </>
      }
    >
      <form id="vault-bulk-edit-form" className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="space-y-1.5 flex flex-col">
            <label className="text-xs font-semibold text-text uppercase tracking-wider">Move to Collection</label>
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
                    <span>{selectedCategory.icon}</span>
                    <span>{selectedCategory.name}</span>
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-text-faint">expand_more</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[calc(50vw-2rem)] sm:w-[220px]">
                <DropdownMenuItem 
                  onClick={() => setCategoryId("no-change")}
                  className="cursor-pointer flex items-center gap-2 h-9"
                >
                  <span className="text-[16px]">➖</span>
                  <span className="font-medium text-[13px] text-text-muted">No change</span>
                </DropdownMenuItem>
                {categories.filter(c => !c.isSmart).map((category) => (
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

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text uppercase tracking-wider">Add Tags (comma separated)</label>
            <input
              value={addTagsInput}
              onChange={(e) => setAddTagsInput(e.target.value)}
              placeholder="e.g. workspace, client-a"
              className={inputBase}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text uppercase tracking-wider">Remove Tags (comma separated)</label>
            <input
              value={removeTagsInput}
              onChange={(e) => setRemoveTagsInput(e.target.value)}
              placeholder="e.g. old, deprecated"
              className={inputBase}
            />
          </div>
        </div>
      </form>
    </ModalShell>
  );
}
