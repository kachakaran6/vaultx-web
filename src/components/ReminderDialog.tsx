import React, { useEffect, useState } from "react";
import { ModalShell } from "./ModalShell";
import { useAppStore } from "../store/app-store";
import { formatDateTimeInputValue, parseDateTimeInputValue } from "../utils/date";
import type { ReminderType } from "../store/types";

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

  return (
    <ModalShell
      open={open}
      onClose={closeReminderDialog}
      title="Set Reminder"
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
                className="px-4 py-2 rounded-xl text-sm font-bold text-vault-danger hover:bg-vault-danger/10 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={closeReminderDialog}
              className="px-4 py-2 rounded-xl text-sm font-bold text-vault-muted hover:text-vault-text transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving}
              className="px-6 py-2 rounded-xl bg-vault-primary text-sm font-bold text-white shadow-subtle transition hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving..." : existingReminder ? "Update Reminder" : "Set Reminder"}
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="p-4 rounded-xl border border-vault-border bg-vault-card/50">
          <p className="text-[11px] font-bold text-vault-muted uppercase tracking-wider">Regarding</p>
          <p className="mt-1 text-[15px] font-semibold text-vault-text truncate">{link?.title}</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-vault-muted uppercase tracking-wider">Date & Time</label>
            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-vault-border bg-vault-card text-sm text-vault-text outline-none focus:border-vault-primary/50 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-vault-muted uppercase tracking-wider">Repeat Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ReminderType)}
              className="w-full h-11 px-4 rounded-xl border border-vault-border bg-vault-card text-sm text-vault-text outline-none focus:border-vault-primary/50 transition-all cursor-pointer"
            >
              <option value="one-time">One-time</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-vault-muted uppercase tracking-wider">Reminder Note</label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Needs immediate review or follow-up"
              className="w-full p-4 rounded-xl border border-vault-border bg-vault-card text-sm text-vault-text outline-none focus:border-vault-primary/50 transition-all placeholder:text-vault-muted/40 resize-none"
            />
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
