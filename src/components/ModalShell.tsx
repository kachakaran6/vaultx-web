import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { PropsWithChildren, ReactNode } from "react";

interface ModalShellProps extends PropsWithChildren {
  open: boolean;
  title: string;
  onClose: () => void;
  footer?: ReactNode;
  widthClassName?: string;
}

export function ModalShell({
  open,
  title,
  onClose,
  footer,
  widthClassName = "max-w-xl",
  children
}: ModalShellProps) {
  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={`relative w-full ${widthClassName} rounded-2xl border border-vault-border bg-vault-card shadow-2xl overflow-hidden`}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-vault-border">
              <h2 className="text-lg font-bold text-vault-text tracking-tight">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-vault-muted hover:text-vault-text hover:bg-vault-elevated transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[80vh] overflow-y-auto px-6 py-6 CustomScrollbar">{children}</div>

            {footer && (
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-vault-border bg-vault-card/50">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
