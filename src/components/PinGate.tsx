import { useState } from "react";
import { LockKeyhole } from "lucide-react";
import { motion } from "framer-motion";
import { useAppStore } from "../store/app-store";

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
      setError("Incorrect PIN");
      setPin("");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        className="absolute inset-0 bg-black/95 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-sm rounded-2xl border border-vault-border bg-vault-card p-8 shadow-2xl"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-vault-primary/10 text-vault-primary mb-6">
          <LockKeyhole size={28} />
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-vault-text tracking-tight uppercase">Vault Locked</h2>
          <p className="text-sm text-vault-muted">Authentication required to access your data.</p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="space-y-4">
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
              className="w-full h-16 rounded-xl border border-vault-border bg-vault-card text-center text-3xl tracking-[1em] pl-[1em] text-vault-text outline-none focus:border-vault-primary/50 transition-all"
            />
            {error && (
              <p className="text-center text-sm font-bold text-vault-danger animate-bounce">
                {error}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => void handleUnlock()}
            disabled={pin.length !== 4 || unlocking}
            className="w-full h-12 rounded-xl bg-vault-primary text-sm font-bold text-white shadow-subtle transition hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
          >
            {unlocking ? "Verifying..." : "Unlock Vault"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
