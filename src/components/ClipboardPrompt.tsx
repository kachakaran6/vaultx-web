import { AnimatePresence, motion } from "framer-motion";
import { Link as LinkIcon } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAppStore } from "../store/app-store";
import { getDomain } from "../utils/url";

export function ClipboardPrompt() {
  const url = useAppStore((state) => state.clipboardPromptUrl);
  const dismiss = useAppStore((state) => state.dismissClipboardPrompt);
  const openAdd = useAppStore((state) => state.openAddDialog);
  const location = useLocation();

  const hasSidebar = ["/home", "/categories", "/stats", "/settings"].includes(location.pathname);

  return (
    <AnimatePresence>
      {url ? (
        <div className={`fixed bottom-24 left-0 right-0 z-30 flex justify-center px-4 pointer-events-none ${hasSidebar ? "lg:left-[180px]" : ""}`}>
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="w-full max-w-lg pointer-events-auto"
          >
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-border/40 bg-card/95 backdrop-blur-xl p-4 shadow-neu-convex">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-neu-soft">
                  <LinkIcon size={20} strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Buffer Signal</p>
                  <p className="truncate text-[15px] font-bold text-foreground tracking-tight">{getDomain(url)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => void dismiss()}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Ignore
                </button>
                <button
                  type="button"
                  onClick={() => {
                    openAdd(undefined, url);
                    void dismiss();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-primary text-xs font-black uppercase tracking-widest text-white shadow-neu-soft hover:shadow-neu-convex transition-all hover:scale-[1.05] active:scale-95"
                >
                  Capture
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
