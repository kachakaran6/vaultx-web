import { useState } from "react";
import { ModalShell } from "./ModalShell";
import { useAppStore } from "../store/app-store";
import { CATEGORY_SWATCHES } from "../utils/colors";

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

  return (
    <ModalShell
      open={isOpen}
      onClose={close}
      title="New Category"
      footer={
        <>
          <button
            type="button"
            onClick={close}
            className="px-4 py-2 rounded-xl text-sm font-bold text-vault-muted hover:text-vault-text transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={saving || !name}
            className="px-6 py-2 rounded-xl bg-vault-primary text-sm font-bold text-white shadow-subtle transition hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create Category"}
          </button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-vault-muted uppercase tracking-wider">Category Name</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Work, Research, Inspiration"
              className="w-full h-11 px-4 rounded-xl border border-vault-border bg-vault-card text-sm text-vault-text outline-none focus:border-vault-primary/50 transition-all placeholder:text-vault-muted/40"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-vault-muted uppercase tracking-wider">Symbol / Icon</label>
            <input
              value={icon}
              maxLength={4}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="📁"
              className="w-full h-11 px-4 rounded-xl border border-vault-border bg-vault-card text-sm text-center text-vault-text outline-none focus:border-vault-primary/50 transition-all placeholder:text-vault-muted/40"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-vault-muted uppercase tracking-wider">Accent Color</label>
            <div className="flex flex-wrap gap-2.5">
              {CATEGORY_SWATCHES.map((swatch) => (
                <button
                  key={swatch}
                  type="button"
                  onClick={() => setColor(swatch)}
                  className={`h-8 w-8 rounded-full transition-transform active:scale-90 ${color === swatch ? "ring-2 ring-white ring-offset-2 ring-offset-vault-card bg-white" : ""
                    }`}
                  style={{ backgroundColor: swatch }}
                  title={swatch}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
