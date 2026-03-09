import { Plus } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAppStore } from "../store/app-store";

export function FloatingAddButton() {
  const location = useLocation();
  const openAddDialog = useAppStore((state) => state.openAddDialog);
  const isLocked = useAppStore((state) => state.settings.appLocked);

  if (isLocked) {
    return null;
  }

  if (!["/home", "/categories"].includes(location.pathname)) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => openAddDialog()}
      className="fixed bottom-8 right-8 z-40 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-vault-primary text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
      aria-label="Add Link"
    >
      <Plus size={26} strokeWidth={2.5} />
    </button>
  );
}
