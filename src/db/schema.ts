import Dexie, { type Table } from "dexie";
import type {
  CategoryRecord,
  LinkRecord,
  ReminderRecord,
  SettingRecord
} from "../store/types";

export class VaultXDatabase extends Dexie {
  links!: Table<LinkRecord, string>;
  categories!: Table<CategoryRecord, string>;
  settings!: Table<SettingRecord, string>;
  reminders!: Table<ReminderRecord, string>;

  constructor() {
    super("vaultx");

    this.version(1).stores({
      links: "&id, normalizedUrl, categoryId, order, visitCount, createdAt, isFavorite, lastVisited",
      categories: "&id, isDefault, createdAt",
      settings: "&key, updatedAt",
      reminders: "&id, linkId, nextTriggerAt, reminderType"
    });
  }
}

export const db = new VaultXDatabase();
