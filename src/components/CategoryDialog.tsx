import { useState } from "react";
import { ModalShell } from "./ModalShell";
import { useAppStore } from "../store/app-store";
import { CATEGORY_SWATCHES } from "../utils/colors";
import { Check } from "lucide-react";

export function CategoryDialog() {
  const isOpen = useAppStore((state) => state.isCategoryDialogOpen);
  const close = useAppStore((state) => state.closeCategoryDialog);
  const addCategory = useAppStore((state) => state.addCategory);

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("📁");
  const [color, setColor] = useState<string>(CATEGORY_SWATCHES[0]);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    setSaving(true);
    const result = await addCategory({ name, icon, color });
    setSaving(false);
    if (result.ok) {
      setName("");
      setIcon("📁");
      setColor(CATEGORY_SWATCHES[0]);
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
      </div>
    </ModalShell>
  );
}
