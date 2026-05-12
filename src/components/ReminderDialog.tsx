import React, { useEffect, useState } from "react";
import { ModalShell } from "./ModalShell";
import { useAppStore } from "../store/app-store";
import { formatDateTimeInputValue, parseDateTimeInputValue } from "../utils/date";
import type { ReminderType } from "../store/types";
import { cn } from "../utils/cn";

export function ReminderDialog() {
  const reminderDialogLinkId = useAppStore((state) => state.reminderDialogLinkId);
  const closeReminderDialog = useAppStore((state) => state.closeReminderDialog);
  const links = useAppStore((state) => state.links);
  const reminders = useAppStore((state) => state.reminders);
  const saveReminder = useAppStore((state) => state.saveReminder);
  const removeReminder = useAppStore((state) => state.removeReminder);

  const link = links.find((entry) => entry.id === reminderDialogLinkId) ?? null;
  const existingReminder = reminders.find((entry) => entry.linkId === reminderDialogLinkId) ?? null;
  const open = Boolean(link);

  const [dateTime, setDateTime] = useState(formatDateTimeInputValue(Date.now() + 60 * 60 * 1000));
  const [type, setType] = useState<ReminderType>("one-time");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (existingReminder) {
      setDateTime(formatDateTimeInputValue(existingReminder.reminderTime));
      setType(existingReminder.reminderType);
      setNote(existingReminder.note);
      return;
    }

    setDateTime(formatDateTimeInputValue(Date.now() + 60 * 60 * 1000));
    setType("one-time");
    setNote("");
  }, [open, link, existingReminder]);

  const handleSave = async () => {
    if (!link) {
      return;
    }

    setSaving(true);
    const result = await saveReminder(link.id, {
      reminderType: type,
      reminderTime: parseDateTimeInputValue(dateTime),
      note
    });
    setSaving(false);
    if (result.ok) {
      closeReminderDialog();
    }
  };

  const inputBase = "w-full h-11 px-3.5 rounded-lg border border-border bg-background text-[14px] text-foreground outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/5 transition-all font-medium shadow-sm placeholder:text-muted-foreground/40";

  return (
    <ModalShell
      open={open}
      onClose={closeReminderDialog}
      title="Set reminder"
      footer={
        <div className="flex w-full items-center justify-between">
          <div>
            {existingReminder && (
              <button
                type="button"
                onClick={() => {
                  if (link) {
                    void removeReminder(link.id);
                  }
                  closeReminderDialog();
                }}
                className="h-9 px-3 rounded-md text-[13px] font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
              >
                Remove reminder
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={closeReminderDialog}
              className="h-10 px-4 rounded-md text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving}
              className="h-10 px-6 rounded-md bg-primary text-white text-[13px] font-bold transition-all hover:opacity-90 disabled:opacity-50 shadow-sm"
            >
              {saving ? "Wait..." : existingReminder ? "Update" : "Set reminder"}
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="px-4 py-3 rounded-lg border border-border bg-secondary/20">
          <p className="text-[12px] font-semibold text-muted-foreground">Attaching to item</p>
          <p className="mt-0.5 text-[14px] font-bold text-foreground truncate">{link?.title}</p>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-foreground">Date and Time</label>
              <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className={inputBase}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-foreground">Frequency</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ReminderType)}
                className={cn(inputBase, "cursor-pointer pr-8 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-[right_12px_center] bg-no-repeat")}
              >
                <option value="one-time">One-time</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-foreground">Notes</label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add context regarding this alert..."
              className={cn(inputBase, "h-auto py-3 resize-none")}
            />
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
