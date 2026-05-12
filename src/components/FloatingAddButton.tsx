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
      className="fixed bottom-20 right-6 lg:bottom-8 lg:right-8 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95 outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-background"
      aria-label="Add new item"
    >
      <Plus size={28} strokeWidth={2.5} />
    </button>
  );
}
