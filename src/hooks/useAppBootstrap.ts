import { useEffect } from "react";
import { useAppStore } from "../store/app-store";
import { decodeSharedLinks } from "../utils/share";
import { buildSnapshot, serializeSnapshot } from "../utils/export";
import { pushToast } from "../store/toast-store";

export function useAppBootstrap(): void {
  const bootstrap = useAppStore((state) => state.bootstrap);
  const importVault = useAppStore((state) => state.importVault);
  const settings = useAppStore((state) => state.settings);

  useEffect(() => {
    void bootstrap().then(async () => {
      const hash = window.location.hash;
      if (hash.startsWith("#import=")) {
        const payload = hash.slice(8);
        window.history.replaceState(null, "", window.location.pathname);
        
        try {
          const links = await decodeSharedLinks(payload);
          if (links.length > 0) {
            pushToast({
              tone: "info",
              title: "Shared Vault Received",
              description: `You received a shared vault with ${links.length} link(s).`,
              duration: 0, // infinite until action or dismissed
              action: {
                label: "Import Links",
                onClick: async () => {
                  const snapshot = buildSnapshot({
                    categories: [],
                    links: links,
                    reminders: [],
                    settings: settings
                  });
                  const rawText = JSON.stringify(snapshot);
                  await importVault(rawText, { mode: "merge" });
                  pushToast({ tone: "success", title: "Links Imported", description: `Successfully imported ${links.length} links.` });
                }
              }
            });
          }
        } catch (e) {
          pushToast({ tone: "danger", title: "Failed to import shared links" });
        }
      }
    });
  }, [bootstrap, importVault, settings]);
}
