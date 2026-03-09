export type ReminderType = "one-time" | "daily" | "weekly" | "monthly";
export type HomeView = "all" | "favorites";
export type ImportMode = "merge" | "replace";

export interface LinkRecord {
  id: string;
  title: string;
  url: string;
  normalizedUrl: string;
  categoryId: string;
  tags: string[];
  notes: string;
  isFavorite: boolean;
  createdAt: number;
  lastVisited: number | null;
  visitCount: number;
  order: number;
}

export interface CategoryRecord {
  id: string;
  name: string;
  isDefault: boolean;
  color: string;
  icon: string;
  createdAt: number;
}

export interface ReminderRecord {
  id: string;
  linkId: string;
  reminderType: ReminderType;
  reminderTime: number;
  nextTriggerAt: number;
  note: string;
  createdAt: number;
}

export interface VaultSettings {
  pinEnabled: boolean;
  pinHash: string | null;
  openInExternalBrowser: boolean;
  lockTimeoutSeconds: number;
  titleHistory: string[];
  clipboardLastPromptUrl: string;
  notificationsEnabled: boolean;
  appLocked: boolean;
}

export type SettingKey = keyof VaultSettings;

export interface SettingRecord<T = unknown> {
  key: SettingKey;
  value: T;
  updatedAt: number;
}

export interface LinkDraft {
  id?: string;
  title: string;
  url: string;
  categoryId: string;
  tags: string[];
  notes: string;
  isFavorite: boolean;
}

export interface CategoryDraft {
  name: string;
  color: string;
  icon: string;
}

export interface ReminderDraft {
  reminderType: ReminderType;
  reminderTime: number;
  note: string;
}

export interface VaultSnapshot {
  version: 1;
  exportedAt: number;
  links: LinkRecord[];
  categories: CategoryRecord[];
  reminders: ReminderRecord[];
  settings: VaultSettings;
}

export interface EncryptedVaultSnapshot {
  version: 1;
  exportedAt: number;
  encrypted: true;
  algorithm: "AES-GCM";
  iterations: number;
  salt: string;
  iv: string;
  payload: string;
}

export interface ImportSummary {
  linksAdded: number;
  linksMerged: number;
  categoriesAdded: number;
  remindersAdded: number;
}
