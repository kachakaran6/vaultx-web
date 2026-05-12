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
            className="absolute inset-0 bg-background/80 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={`relative w-full ${widthClassName} rounded-xl border border-border bg-card shadow-2xl overflow-hidden transition-all`}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h2 className="text-[17px] font-semibold text-foreground tracking-tight">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            <div className="max-h-[80vh] overflow-y-auto px-6 py-6 hide-scrollbar">{children}</div>

            {footer && (
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-secondary/30">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
