import type {
  EncryptedVaultSnapshot,
  VaultSettings,
  VaultSnapshot,
  CategoryRecord,
  LinkRecord,
  ReminderRecord
} from "../store/types";
import { decryptText, encryptText } from "./security";

function sanitizeArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export function buildSnapshot(input: {
  categories: CategoryRecord[];
  links: LinkRecord[];
  reminders: ReminderRecord[];
  settings: VaultSettings;
}): VaultSnapshot {
  return {
    version: 1,
    exportedAt: Date.now(),
    categories: input.categories,
    links: input.links,
    reminders: input.reminders,
    settings: input.settings
  };
}

export async function serializeSnapshot(
  snapshot: VaultSnapshot,
  options?: { encrypted?: boolean; password?: string }
): Promise<string> {
  if (!options?.encrypted) {
    return JSON.stringify(snapshot, null, 2);
  }

  if (!options.password?.trim()) {
    throw new Error("A password is required for encrypted exports.");
  }

  const encryptedBody = await encryptText(JSON.stringify(snapshot), options.password);
  const encryptedSnapshot: EncryptedVaultSnapshot = {
    version: 1,
    exportedAt: snapshot.exportedAt,
    encrypted: true,
    ...encryptedBody
  };

  return JSON.stringify(encryptedSnapshot, null, 2);
}

export async function parseImportedSnapshot(
  rawText: string,
  password?: string
): Promise<VaultSnapshot> {
  const parsed = JSON.parse(rawText) as Partial<VaultSnapshot & EncryptedVaultSnapshot>;

  if (parsed.encrypted) {
    if (!password?.trim()) {
      throw new Error("This backup is encrypted. Enter the backup password.");
    }

    const decrypted = await decryptText(parsed as EncryptedVaultSnapshot, password);
    return parseImportedSnapshot(decrypted);
  }

  return {
    version: 1,
    exportedAt: typeof parsed.exportedAt === "number" ? parsed.exportedAt : Date.now(),
    categories: sanitizeArray<CategoryRecord>(parsed.categories),
    links: sanitizeArray<LinkRecord>(parsed.links),
    reminders: sanitizeArray<ReminderRecord>(parsed.reminders),
    settings: {
      pinEnabled: Boolean(parsed.settings?.pinEnabled),
      pinHash: parsed.settings?.pinHash ?? null,
      openInExternalBrowser: Boolean(parsed.settings?.openInExternalBrowser),
      lockTimeoutSeconds:
        typeof parsed.settings?.lockTimeoutSeconds === "number"
          ? parsed.settings.lockTimeoutSeconds
          : 30,
      titleHistory: sanitizeArray<string>(parsed.settings?.titleHistory),
      clipboardLastPromptUrl: parsed.settings?.clipboardLastPromptUrl ?? "",
      notificationsEnabled: Boolean(parsed.settings?.notificationsEnabled),
      appLocked: false
    }
  };
}

export function downloadTextFile(fileName: string, content: string): void {
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}
