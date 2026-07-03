import { db } from "./schema";
import type { SettingRecord, VaultSettings } from "../store/types";
import { createDefaultCategories } from "../utils/colors";

export const DEFAULT_SETTINGS: VaultSettings = {
  pinEnabled: false,
  pinHash: null,
  openInExternalBrowser: false,
  lockTimeoutSeconds: 30,
  titleHistory: [],
  clipboardLastPromptUrl: "",
  notificationsEnabled: false,
  appLocked: false,
  viewMode: "list"
};

export function createDefaultSettingRecords(now = Date.now()): SettingRecord[] {
  return (
    Object.entries(DEFAULT_SETTINGS) as [keyof VaultSettings, VaultSettings[keyof VaultSettings]][]
  ).map(
    ([key, value], index) =>
      ({
        key,
        value,
        updatedAt: now + index
      }) satisfies SettingRecord
  );
}

export function settingsArrayToObject(records: SettingRecord[]): VaultSettings {
  const next = { ...DEFAULT_SETTINGS };

  for (const record of records) {
    (next as Record<string, unknown>)[record.key] = record.value;
  }

  if (!next.pinEnabled || !next.pinHash) {
    next.pinEnabled = false;
    next.appLocked = false;
  }

  return next;
}

export async function ensureSeedData(): Promise<void> {
  const existingCategories = await db.categories.toArray();
  if (existingCategories.length === 0) {
    await db.categories.bulkAdd(createDefaultCategories());
  } else {
    const missingDefaults = createDefaultCategories().filter(
      (category) => !existingCategories.some((existing) => existing.id === category.id)
    );

    if (missingDefaults.length > 0) {
      await db.categories.bulkPut(missingDefaults);
    }
  }

  const settingsRecords = await db.settings.toArray();
  const existingKeys = new Set(settingsRecords.map((record) => record.key));
  const now = Date.now();

  const missingSettings = createDefaultSettingRecords(now).filter(
    (record) => !existingKeys.has(record.key)
  );

  if (missingSettings.length > 0) {
    await db.settings.bulkPut(missingSettings);
  }
}
