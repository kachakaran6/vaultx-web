import { useState } from "react";
import { ModalShell } from "./ModalShell";
import { useAppStore } from "../store/app-store";
import { CATEGORY_SWATCHES } from "../utils/colors";
import { Check } from "lucide-react";
import { Switch } from "./ui/switch";

export function CategoryDialog() {
  const isOpen = useAppStore((state) => state.isCategoryDialogOpen);
  const close = useAppStore((state) => state.closeCategoryDialog);
  const addCategory = useAppStore((state) => state.addCategory);
  const categories = useAppStore((state) => state.categories);

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("📁");
  const [color, setColor] = useState<string>(CATEGORY_SWATCHES[0]);
  const [parentCategoryId, setParentCategoryId] = useState("");
  const [isSmart, setIsSmart] = useState(false);
  const [smartTags, setSmartTags] = useState("");
  const [smartQuery, setSmartQuery] = useState("");
  const [smartFavoriteOnly, setSmartFavoriteOnly] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    setSaving(true);
    const tags = smartTags.split(",").map(t => t.trim()).filter(Boolean);
    const rules = isSmart ? {
      tags: tags.length > 0 ? tags : undefined,
      query: smartQuery.trim() || undefined,
      favoriteOnly: smartFavoriteOnly || undefined
    } : undefined;

    const result = await addCategory({ 
      name, 
      icon, 
      color, 
      isSmart, 
      rules,
      parentCategoryId: isSmart ? undefined : (parentCategoryId || undefined)
    });
    setSaving(false);
    if (result.ok) {
      setName("");
      setIcon("📁");
      setColor(CATEGORY_SWATCHES[0]);
      setParentCategoryId("");
      setIsSmart(false);
      setSmartTags("");
      setSmartQuery("");
      setSmartFavoriteOnly(false);
      close();
    }
  };

  const inputBase = "w-full h-11 px-3.5 rounded-lg border border-border bg-secondary/40 dark:bg-secondary/20 text-[14px] text-foreground outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-muted-foreground/70 font-medium shadow-sm";

  return (
    <ModalShell
      open={isOpen}
      onClose={close}
      title="New collection"
      footer={
        <>
          <button
            type="button"
            onClick={close}
            className="h-10 px-4 rounded-md text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors hover:bg-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={saving || !name}
            className="h-10 px-6 rounded-md bg-primary text-white text-[13px] font-bold transition-all hover:opacity-90 disabled:opacity-50 shadow-sm"
          >
            {saving ? "Saving..." : "Create"}
          </button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-12">
          <div className="sm:col-span-9 space-y-1.5">
            <label className="text-[13px] font-semibold text-foreground">Collection name</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Design, Reads, Personal"
              className={inputBase}
            />
          </div>

          <div className="sm:col-span-3 space-y-1.5">
            <label className="text-[13px] font-semibold text-foreground">Icon</label>
            <input
              value={icon}
              maxLength={4}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="📁"
              className={`${inputBase} text-center text-lg`}
            />
          </div>
        </div>

        <div className="space-y-2.5">
          <label className="text-[13px] font-semibold text-foreground">Choose a color</label>
          <div className="flex flex-wrap gap-2.5">
            {CATEGORY_SWATCHES.map((swatch) => {
              const isSelected = color === swatch;
              return (
                <button
                  key={swatch}
                  type="button"
                  onClick={() => setColor(swatch)}
                  className="relative group h-8 w-8 rounded-full outline-none transition-all flex items-center justify-center cursor-pointer hover:scale-110"
                  style={{ backgroundColor: swatch }}
                  title={swatch}
                >
                  {isSelected && (
                    <div className="text-white drop-shadow-sm">
                      <Check size={14} strokeWidth={4} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {!isSmart && (
          <div className="space-y-1.5 pt-2">
            <label className="text-[13px] font-semibold text-foreground">Parent Category (Optional)</label>
            <select
              value={parentCategoryId}
              onChange={(e) => setParentCategoryId(e.target.value)}
              className={inputBase}
            >
              <option value="">None (Top-Level Category)</option>
              {categories.filter(c => !c.parentCategoryId && !c.isSmart && c.id !== "general").map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}

        <div className="pt-4 border-t border-border space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-[13px] font-semibold text-foreground">Smart Collection</label>
              <p className="text-xs text-text-muted">Automatically aggregate links using dynamic rules.</p>
            </div>
            <Switch 
              checked={isSmart}
              onCheckedChange={setIsSmart}
            />
          </div>

          {isSmart && (
            <div className="space-y-4 p-3 bg-secondary/20 dark:bg-secondary/10 rounded-lg border border-border/60 animate-in fade-in duration-200">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text uppercase tracking-wider">Has Tags (comma separated)</label>
                <input
                  value={smartTags}
                  onChange={(e) => setSmartTags(e.target.value)}
                  placeholder="e.g. read, design"
                  className={inputBase}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text uppercase tracking-wider">URL or Title Contains</label>
                <input
                  value={smartQuery}
                  onChange={(e) => setSmartQuery(e.target.value)}
                  placeholder="e.g. github.com"
                  className={inputBase}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="space-y-0.5">
                  <label className="text-xs font-semibold text-text uppercase tracking-wider">Favorite Items Only</label>
                </div>
                <Switch 
                  checked={smartFavoriteOnly}
                  onCheckedChange={setSmartFavoriteOnly}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </ModalShell>
  );
}
