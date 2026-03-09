import { useEffect } from "react";
import { useAppStore } from "../store/app-store";
import { extractUrlFromText, normalizeUrl } from "../utils/url";

export function useClipboardWatcher(enabled: boolean): void {
  useEffect(() => {
    if (!enabled || typeof navigator === "undefined" || !navigator.clipboard?.readText) {
      return;
    }

    let cancelled = false;

    const inspectClipboard = async () => {
      if (cancelled || document.visibilityState !== "visible") {
        return;
      }

      const state = useAppStore.getState();
      if (state.settings.appLocked || state.clipboardPromptUrl) {
        return;
      }

      try {
        if ("permissions" in navigator && navigator.permissions?.query) {
          const permission = await navigator.permissions.query({
            // `clipboard-read` is not in PermissionName on all browsers yet.
            name: "clipboard-read" as PermissionName
          });

          if (permission.state === "denied") {
            return;
          }
        }

        const text = await navigator.clipboard.readText();
        const url = extractUrlFromText(text.trim());
        if (!url) {
          return;
        }

        const normalizedUrl = normalizeUrl(url);
        if (!normalizedUrl) {
          return;
        }

        if (state.settings.clipboardLastPromptUrl === normalizedUrl) {
          return;
        }

        if (state.links.some((link) => link.normalizedUrl === normalizedUrl)) {
          return;
        }

        useAppStore.getState().showClipboardPrompt(url);
      } catch {
        // Clipboard access is permission-gated on most browsers. Silent failure is expected.
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        void inspectClipboard();
      }
    };

    window.addEventListener("focus", inspectClipboard);
    document.addEventListener("visibilitychange", handleVisibility);
    void inspectClipboard();

    return () => {
      cancelled = true;
      window.removeEventListener("focus", inspectClipboard);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [enabled]);
}
