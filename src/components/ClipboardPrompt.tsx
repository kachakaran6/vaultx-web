import { AnimatePresence, motion } from "framer-motion";
import { Link as LinkIcon } from "lucide-react";
import { useAppStore } from "../store/app-store";
import { getDomain } from "../utils/url";

export function ClipboardPrompt() {
  const url = useAppStore((state) => state.clipboardPromptUrl);
  const dismiss = useAppStore((state) => state.dismissClipboardPrompt);
  const openAdd = useAppStore((state) => state.openAddDialog);

  return (
    <AnimatePresence>
      {url ? (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-24 left-1/2 z-30 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 lg:left-[calc(240px+50%)] lg:-translate-x-1/2"
        >
          <div className="flex items-center justify-between gap-4 rounded-xl border border-vault-border bg-vault-card p-4 shadow-2xl">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-vault-primary/10 text-vault-primary">
                <LinkIcon size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-vault-muted uppercase tracking-wider">Link detected</p>
                <p className="truncate text-sm font-semibold text-vault-text">{getDomain(url)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => void dismiss()}
                className="px-4 py-2 rounded-lg text-sm font-bold text-vault-muted hover:text-vault-text hover:bg-vault-elevated transition-colors"
              >
                Ignore
              </button>
              <button
                type="button"
                onClick={() => {
                  openAdd(undefined, url);
                  void dismiss();
                }}
                className="px-4 py-2 rounded-lg bg-vault-primary text-sm font-bold text-white shadow-subtle transition hover:opacity-90 active:scale-95"
              >
                Save Link
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
