import type { ReminderType } from "../store/types";

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;

export function formatRelativeTime(timestamp: number | null): string {
  if (!timestamp) {
    return "Never";
  }

  const diff = Date.now() - timestamp;
  if (diff < 60_000) {
    return "Just now";
  }

  if (diff < 3_600_000) {
    return `${Math.floor(diff / 60_000)}m ago`;
  }

  if (diff < DAY_MS) {
    return `${Math.floor(diff / 3_600_000)}h ago`;
  }

  if (diff < 7 * DAY_MS) {
    return `${Math.floor(diff / DAY_MS)}d ago`;
  }

  return new Date(timestamp).toLocaleDateString();
}

export function formatDateTimeInputValue(timestamp: number): string {
  const date = new Date(timestamp);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(timestamp - offset).toISOString().slice(0, 16);
}

export function parseDateTimeInputValue(value: string): number {
  return new Date(value).getTime();
}

function addMonth(timestamp: number): number {
  const source = new Date(timestamp);
  const day = source.getDate();
  const target = new Date(source);
  target.setDate(1);
  target.setMonth(target.getMonth() + 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(day, lastDay));
  target.setHours(source.getHours(), source.getMinutes(), source.getSeconds(), source.getMilliseconds());
  return target.getTime();
}

export function advanceReminderTime(timestamp: number, type: ReminderType): number {
  switch (type) {
    case "daily":
      return timestamp + DAY_MS;
    case "weekly":
      return timestamp + WEEK_MS;
    case "monthly":
      return addMonth(timestamp);
    default:
      return timestamp;
  }
}

export function getNextReminderTrigger(
  reminderTime: number,
  type: ReminderType,
  reference = Date.now()
): number {
  if (type === "one-time") {
    return reminderTime;
  }

  let next = reminderTime;
  while (next <= reference) {
    next = advanceReminderTime(next, type);
  }

  return next;
}
