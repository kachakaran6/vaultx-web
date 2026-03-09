import { useEffect } from "react";
import { useAppStore } from "../store/app-store";

export function useVaultLock(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    let hiddenAt: number | null = null;

    const handleVisibility = () => {
      const state = useAppStore.getState();
      if (!state.settings.pinEnabled || !state.settings.pinHash) {
        hiddenAt = null;
        return;
      }

      if (document.visibilityState === "hidden") {
        hiddenAt = Date.now();
        return;
      }

      if (hiddenAt === null) {
        return;
      }

      const elapsedSeconds = (Date.now() - hiddenAt) / 1000;
      hiddenAt = null;
      if (elapsedSeconds >= state.settings.lockTimeoutSeconds) {
        state.lockVault();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [enabled]);
}
