import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useToastStore } from "../store/toast-store";
import { CheckCircle2, AlertCircle, Info, XCircle } from "lucide-react";

const TONE_MAP = {
  info: { color: "text-blue-500", icon: Info },
  success: { color: "text-emerald-500", icon: CheckCircle2 },
  warning: { color: "text-orange-500", icon: AlertCircle },
  danger: { color: "text-rose-500", icon: XCircle }
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
    <div className="fixed bottom-6 right-6 z-[70] flex flex-col-reverse gap-3 w-80 pointer-events-none">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const config = TONE_MAP[toast.tone];
          const Icon = config.icon;
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, transition: { duration: 0.15 } }}
              layout
              className="flex items-start gap-3.5 p-4 rounded-lg border border-border bg-card shadow-lg pointer-events-auto"
            >
              <Icon className={`h-5 w-5 shrink-0 ${config.color}`} strokeWidth={2.5} />
              <div className="min-w-0 pt-0.5">
                <h4 className="text-[14px] font-semibold text-foreground leading-none">{toast.title}</h4>
                {toast.description && (
                  <p className="mt-1.5 text-[13px] font-medium text-muted-foreground leading-snug">{toast.description}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
