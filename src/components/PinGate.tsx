import { useState } from "react";
import { LockKeyhole } from "lucide-react";
import { motion } from "framer-motion";
import { useAppStore } from "../store/app-store";
import { cn } from "../utils/cn";

export function PinGate() {
  const isLocked = useAppStore((state) => state.settings.appLocked);
  const unlockVault = useAppStore((state) => state.unlockVault);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [unlocking, setUnlocking] = useState(false);

  if (!isLocked) {
    return null;
  }

  const handleUnlock = async () => {
    setUnlocking(true);
    const valid = await unlockVault(pin);
    setUnlocking(false);
    if (!valid) {
      setError("Incorrect security PIN");
      setPin("");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        className="absolute inset-0 bg-background/90 backdrop-blur-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-sm rounded-xl border border-border bg-card p-8 shadow-2xl"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-6 border border-primary/10">
          <LockKeyhole size={28} strokeWidth={2.5} />
        </div>

        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Vault locked</h2>
          <p className="text-[14px] font-medium text-muted-foreground">Enter your security PIN to continue</p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="space-y-3">
            <input
              autoFocus
              inputMode="numeric"
              maxLength={4}
              type="password"
              value={pin}
              onChange={(e) => {
                setError("");
                setPin(e.target.value.replace(/\D/g, "").slice(0, 4));
              }}
              onKeyDown={(e) => e.key === "Enter" && pin.length === 4 && void handleUnlock()}
              className={cn(
                "w-full h-16 rounded-lg border bg-background text-center text-3xl tracking-[0.8em] pl-[0.8em] font-bold text-foreground outline-none transition-all shadow-sm",
                error ? "border-rose-500 focus:ring-rose-500/10" : "border-border focus:border-primary/60 focus:ring-4 focus:ring-primary/5"
              )}
            />
            {error && (
              <p className="text-center text-[13px] font-semibold text-rose-600 animate-pulse">
                {error}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => void handleUnlock()}
            disabled={pin.length !== 4 || unlocking}
            className="w-full h-12 rounded-lg bg-primary text-[14px] font-bold text-white shadow-sm transition-all hover:opacity-90 disabled:opacity-50"
          >
            {unlocking ? "Verifying..." : "Unlock Vault"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
