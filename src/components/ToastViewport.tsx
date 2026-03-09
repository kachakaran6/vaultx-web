import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useToastStore } from "../store/toast-store";

const TONE_COLORS = {
  info: "bg-vault-primary",
  success: "bg-vault-success",
  warning: "bg-vault-warning",
  danger: "bg-vault-danger"
} as const;

export function ToastViewport() {
  const { toasts, dismiss } = useToastStore();

  useEffect(() => {
    const timeouts = toasts.map((toast) =>
      window.setTimeout(() => {
        dismiss(toast.id);
      }, 4000)
    );

    return () => {
      timeouts.forEach((timeout) => window.clearTimeout(timeout));
    };
  }, [toasts, dismiss]);

  return (
    <div className="fixed bottom-6 right-6 z-[70] flex flex-col gap-3 w-80 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="flex items-start gap-3 p-4 rounded-xl border border-vault-border bg-vault-card shadow-2xl pointer-events-auto"
          >
            <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${TONE_COLORS[toast.tone]}`} />
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-vault-text tracking-tight">{toast.title}</h4>
              {toast.description && (
                <p className="mt-1 text-xs text-vault-muted leading-relaxed">{toast.description}</p>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
