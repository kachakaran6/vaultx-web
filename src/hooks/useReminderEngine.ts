import { useEffect } from "react";
import { pushToast } from "../store/toast-store";
import { useAppStore } from "../store/app-store";
import { showVaultNotification } from "../utils/notifications";

export function useReminderEngine(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    let disposed = false;

    const tick = async () => {
      if (disposed) {
        return;
      }

      const state = useAppStore.getState();
      if (state.settings.appLocked) {
        return;
      }

      const dueReminders = state.reminders.filter((reminder) => reminder.nextTriggerAt <= Date.now());
      for (const reminder of dueReminders) {
        const link = state.links.find((entry) => entry.id === reminder.linkId);
        if (!link) {
          continue;
        }

        const body = reminder.note.trim() ? `${reminder.note} - ${link.title}` : link.title;
        const shown = showVaultNotification("Vault X Reminder", body);
        if (!shown) {
          pushToast({
            tone: "info",
            title: "Vault X Reminder",
            description: body
          });
        }

        await useAppStore.getState().processReminderDue(reminder.id);
      }
    };

    const interval = window.setInterval(() => {
      void tick();
    }, 30_000);

    void tick();

    return () => {
      disposed = true;
      window.clearInterval(interval);
    };
  }, [enabled]);
}
