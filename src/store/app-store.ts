import { create } from "zustand";
import { db } from "../db/schema";
import {
  createDefaultSettingRecords,
  DEFAULT_SETTINGS,
  ensureSeedData,
  settingsArrayToObject
} from "../db/seed";
import {
  buildSnapshot,
  downloadTextFile,
  parseImportedSnapshot,
  serializeSnapshot
} from "../utils/export";
import { CATEGORY_SWATCHES, createDefaultCategories, slugifyCategoryId } from "../utils/colors";
import { advanceReminderTime, getNextReminderTrigger } from "../utils/date";
import { ensureNotificationPermission } from "../utils/notifications";
import { hashPin, verifyPin, detectConfusableDomain } from "../utils/security";
import { getDomain, ensureUrlProtocol, normalizeUrl } from "../utils/url";
import { pushToast } from "./toast-store";
import type {
  CategoryDraft,
  CategoryRecord,
  HomeView,
  ImportMode,
  ImportSummary,
  LinkDraft,
  LinkRecord,
  ReminderDraft,
  ReminderRecord,
  SettingKey,
  SettingRecord,
  VaultSettings
} from "./types";

function sortLinks(links: LinkRecord[]): LinkRecord[] {
  return [...links].sort((a, b) => {
    const pinA = a.isPinned ? 1 : 0;
    const pinB = b.isPinned ? 1 : 0;
    if (pinA !== pinB) {
      return pinB - pinA;
    }
    return a.order - b.order || b.createdAt - a.createdAt;
  });
}

function sortCategories(categories: CategoryRecord[]): CategoryRecord[] {
  return [...categories].sort((a, b) => a.createdAt - b.createdAt || a.name.localeCompare(b.name));
}

function isYesterday(dateStr: string): boolean {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(dateStr);
  checkDate.setHours(0, 0, 0, 0);
  const diffTime = today.getTime() - checkDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1;
}

function inferSemanticTags(tags: string[]): string[] {
  const inferred = new Set<string>(tags.map(t => t.toLowerCase()));
  tags.forEach(t => {
    const lower = t.toLowerCase();
    if (lower === "react" || lower === "vue" || lower === "angular") {
      inferred.add("frontend");
      inferred.add("javascript");
    }
    if (lower === "rust" || lower === "go" || lower === "python" || lower === "nodejs") {
      inferred.add("backend");
    }
    if (lower === "docker" || lower === "kubernetes" || lower === "aws") {
      inferred.add("devops");
      inferred.add("cloud");
    }
  });
  return Array.from(inferred);
}

function sortReminders(reminders: ReminderRecord[]): ReminderRecord[] {
  return [...reminders].sort((a, b) => a.nextTriggerAt - b.nextTriggerAt);
}

function mergeUniqueStrings(...collections: string[][]): string[] {
  const values = new Map<string, string>();

  for (const collection of collections) {
    for (const entry of collection) {
      const trimmed = entry.trim();
      if (!trimmed) {
        continue;
      }

      const key = trimmed.toLowerCase();
      if (!values.has(key)) {
        values.set(key, trimmed);
      }
    }
  }

  return [...values.values()];
}

function sanitizeTags(tags: string[]): string[] {
  return mergeUniqueStrings(tags.map((tag) => tag.replace(/^#/, "").trim()));
}

function getGeneralCategoryId(categories: CategoryRecord[]): string {
  return categories.find((category) => category.id === "general")?.id ?? categories[0]?.id ?? "general";
}

async function persistSetting(key: SettingKey, value: VaultSettings[SettingKey]): Promise<void> {
  if (key === "appLocked") {
    return;
  }

  await db.settings.put({
    key,
    value,
    updatedAt: Date.now()
  } as SettingRecord);
}

interface AppStore {
  ready: boolean;
  bootstrapping: boolean;
  links: LinkRecord[];
  categories: CategoryRecord[];
  reminders: ReminderRecord[];
  settings: VaultSettings;
  searchQuery: string;
  selectedCategoryId: string | null;
  homeView: HomeView;
  addDialogLinkId: string | null;
  addDialogPresetUrl: string;
  reminderDialogLinkId: string | null;
  isCategoryDialogOpen: boolean;
  isAddDialogOpen: boolean;
  clipboardPromptUrl: string | null;
  bootstrap: () => Promise<void>;
  refreshVault: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  toggleCategoryFilter: (categoryId: string) => void;
  clearFilters: () => void;
  setHomeView: (view: HomeView) => void;
  openAddDialog: (linkId?: string | null, presetUrl?: string) => void;
  closeAddDialog: () => void;
  openReminderDialog: (linkId: string) => void;
  closeReminderDialog: () => void;
  openCategoryDialog: () => void;
  closeCategoryDialog: () => void;
  showClipboardPrompt: (url: string) => void;
  dismissClipboardPrompt: (remember?: boolean) => Promise<void>;
  updateSetting: <K extends SettingKey>(key: K, value: VaultSettings[K]) => Promise<void>;
  saveLink: (draft: LinkDraft) => Promise<{ ok: boolean; reason?: string }>;
  deleteLink: (linkId: string) => Promise<void>;
  bulkDeleteLinks: (linkIds: string[]) => Promise<void>;
  bulkUpdateLinksMetadata: (
    linkIds: string[],
    updates: { categoryId?: string; addTags?: string[]; removeTags?: string[] }
  ) => Promise<void>;
  toggleFavorite: (linkId: string) => Promise<void>;
  recordVisit: (linkId: string) => Promise<void>;
  reorderLinks: (orderedIds: string[]) => Promise<void>;
  addCategory: (draft: CategoryDraft) => Promise<{ ok: boolean; reason?: string }>;
  deleteCategory: (categoryId: string) => Promise<void>;
  saveReminder: (linkId: string, draft: ReminderDraft) => Promise<{ ok: boolean; reason?: string }>;
  removeReminder: (linkId: string) => Promise<void>;
  processReminderDue: (reminderId: string) => Promise<void>;
  exportVault: (options?: { encrypted?: boolean; password?: string }) => Promise<void>;
  importVault: (rawText: string, options?: { mode?: ImportMode; password?: string }) => Promise<ImportSummary>;
  resetVault: () => Promise<void>;
  setPin: (pin: string) => Promise<void>;
  clearPin: () => Promise<void>;
  unlockVault: (pin: string) => Promise<boolean>;
  lockVault: () => void;
  timeMachineDate: string | null;
  setTimeMachineDate: (date: string | null) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  ready: false,
  bootstrapping: false,
  links: [],
  categories: [],
  reminders: [],
  settings: DEFAULT_SETTINGS,
  searchQuery: "",
  selectedCategoryId: null,
  homeView: "all",
  addDialogLinkId: null,
  addDialogPresetUrl: "",
  reminderDialogLinkId: null,
  isCategoryDialogOpen: false,
  isAddDialogOpen: false,
  clipboardPromptUrl: null,
  timeMachineDate: null,
  setTimeMachineDate: (date) => set({ timeMachineDate: date }),

  bootstrap: async () => {
    if (get().bootstrapping || get().ready) {
      return;
    }

    set({ bootstrapping: true });

    await ensureSeedData();
    await get().refreshVault();

    set((state) => ({
      ready: true,
      bootstrapping: false,
      settings: {
        ...state.settings,
        appLocked: state.settings.pinEnabled && Boolean(state.settings.pinHash)
      }
    }));
  },

  refreshVault: async () => {
    let links = await db.links.toArray();
    
    const now = Date.now();
    const expiredIds = links.filter(l => 
      (l.expiresAt && l.expiresAt <= now) || 
      (l.maxVisits && l.visitCount >= l.maxVisits)
    ).map(l => l.id);

    if (expiredIds.length > 0) {
      await db.transaction("rw", db.links, db.reminders, async () => {
        await db.links.bulkDelete(expiredIds);
        await db.reminders.where("linkId").anyOf(expiredIds).delete();
      });
      links = await db.links.toArray();
    }

    const [categories, reminders, settingsRecords] = await Promise.all([
      db.categories.toArray(),
      db.reminders.toArray(),
      db.settings.toArray()
    ]);

    const nextSettings = settingsArrayToObject(settingsRecords);
    const locked = get().settings.appLocked;
    nextSettings.appLocked = locked && nextSettings.pinEnabled && Boolean(nextSettings.pinHash);

    set({
      links: sortLinks(links),
      categories: sortCategories(categories),
      reminders: sortReminders(reminders),
      settings: nextSettings
    });
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  toggleCategoryFilter: (categoryId) =>
    set((state) => ({
      selectedCategoryId: state.selectedCategoryId === categoryId ? null : categoryId
    })),

  clearFilters: () => set({ searchQuery: "", selectedCategoryId: null, homeView: "all" }),

  setHomeView: (view) => set({ homeView: view }),

  openAddDialog: (linkId = null, presetUrl = "") =>
    set({
      addDialogLinkId: linkId,
      addDialogPresetUrl: presetUrl,
      isAddDialogOpen: true
    }),

  closeAddDialog: () =>
    set({
      addDialogLinkId: null,
      addDialogPresetUrl: "",
      isAddDialogOpen: false
    }),

  openReminderDialog: (linkId) => set({ reminderDialogLinkId: linkId }),

  closeReminderDialog: () => set({ reminderDialogLinkId: null }),

  openCategoryDialog: () => set({ isCategoryDialogOpen: true }),

  closeCategoryDialog: () => set({ isCategoryDialogOpen: false }),

  showClipboardPrompt: (url) => {
    if (!get().clipboardPromptUrl) {
      set({ clipboardPromptUrl: url });
    }
  },

  dismissClipboardPrompt: async (remember = true) => {
    const url = get().clipboardPromptUrl;
    if (remember && url) {
      await get().updateSetting("clipboardLastPromptUrl", normalizeUrl(url));
    }
    set({ clipboardPromptUrl: null });
  },

  updateSetting: async (key, value) => {
    await persistSetting(key, value);
    set((state) => ({
      settings: {
        ...state.settings,
        [key]: value
      } as VaultSettings
    }));
  },

  saveLink: async (draft) => {
    const preparedUrl = ensureUrlProtocol(draft.url);
    const normalizedUrl = normalizeUrl(preparedUrl);
    if (!normalizedUrl) {
      pushToast({
        tone: "warning",
        title: "Invalid URL",
        description: "Enter a valid http or https link."
      });
      return { ok: false, reason: "invalid-url" };
    }

    const phishingTarget = detectConfusableDomain(preparedUrl);
    if (phishingTarget) {
      pushToast({
        tone: "warning",
        title: "Suspicious Domain Alert! ⚠️",
        description: `This address lookalike targets "${phishingTarget}". Please verify accuracy before saving.`
      });
    }

    const existing = draft.id ? get().links.find((link) => link.id === draft.id) : undefined;
    const duplicate = get().links.find(
      (link) => link.normalizedUrl === normalizedUrl && link.id !== draft.id
    );

    if (duplicate) {
      pushToast({
        tone: "warning",
        title: "This link already exists.",
        description: duplicate.title
      });
      return { ok: false, reason: "duplicate" };
    }

    // Auto-Categorization based on URL/title keywords
    let categoryId = draft.categoryId;
    if (categoryId === "general" || !categoryId) {
      const titleLower = draft.title.toLowerCase();
      const urlLower = preparedUrl.toLowerCase();
      const matchedCat = get().categories.find((c) => {
        if (c.isSmart || c.id === "general") return false;
        const name = c.name.toLowerCase();
        if (name.includes("dev") || name.includes("code") || name.includes("tech")) {
          return urlLower.includes("github") || urlLower.includes("stackoverflow") || urlLower.includes("npm") || titleLower.includes("programming") || titleLower.includes("code");
        }
        if (name.includes("media") || name.includes("video") || name.includes("entertainment") || name.includes("social")) {
          return urlLower.includes("youtube") || urlLower.includes("vimeo") || urlLower.includes("twitter") || urlLower.includes("x.com") || urlLower.includes("instagram");
        }
        if (name.includes("read") || name.includes("article") || name.includes("news") || name.includes("blog")) {
          return urlLower.includes("medium.com") || urlLower.includes("substack") || urlLower.includes("nytimes") || urlLower.includes("wikipedia");
        }
        return false;
      });
      if (matchedCat) {
        categoryId = matchedCat.id;
        pushToast({
          tone: "info",
          title: "Auto-Categorized! 📁",
          description: `Mapped to "${matchedCat.name}" based on keywords.`
        });
      } else {
        categoryId = getGeneralCategoryId(get().categories);
      }
    }

    // Auto-Summarization: extract 3 bullet points if notes are empty
    let finalNotes = draft.notes.trim();
    if (!finalNotes && draft.title) {
      const bullet1 = `• Bookmark saved from ${getDomain(preparedUrl)}.`;
      const bullet2 = `• Focus Area: ${draft.title}.`;
      const bullet3 = draft.tags.length > 0 
        ? `• Tagged under: ${draft.tags.join(", ")}.` 
        : `• Automatically parsed for quick offline retrieval.`;
      finalNotes = `${bullet1}\n${bullet2}\n${bullet3}`;
    }

    const semanticTags = inferSemanticTags(draft.tags);

    const topOrder =
      get().links.length === 0 ? 0 : Math.min(...get().links.map((link) => link.order)) - 1;
    const now = Date.now();
    const link: LinkRecord = {
      id: existing?.id ?? crypto.randomUUID(),
      title: draft.title.trim() || getDomain(preparedUrl),
      url: preparedUrl,
      normalizedUrl,
      categoryId,
      tags: sanitizeTags(semanticTags),
      notes: finalNotes,
      isFavorite: draft.isFavorite,
      username: draft.username?.trim() || undefined,
      password: draft.password?.trim() || undefined,
      expiresAt: draft.expiresAt,
      maxVisits: draft.maxVisits,
      isPinned: draft.isPinned || false,
      image: draft.image || existing?.image,
      icon: draft.icon || existing?.icon,
      workspaceId: draft.workspaceId || get().settings.activeWorkspaceId || "default",
      backlinkIds: draft.backlinkIds || existing?.backlinkIds || [],
      scrollPosition: draft.scrollPosition || existing?.scrollPosition || 0,
      createdAt: existing?.createdAt ?? now,
      lastVisited: existing?.lastVisited ?? null,
      visitCount: existing?.visitCount ?? 0,
      order: existing?.order ?? topOrder
    };

    await db.links.put(link);

    const titleHistory = mergeUniqueStrings([link.title], get().settings.titleHistory).slice(0, 20);
    await get().updateSetting("titleHistory", titleHistory);
    await get().refreshVault();

    pushToast({
      tone: "success",
      title: existing ? "Link updated" : "Link saved",
      description: link.title
    });

    return { ok: true };
  },

  deleteLink: async (linkId) => {
    await db.transaction("rw", db.links, db.reminders, async () => {
      await db.links.delete(linkId);
      const reminder = await db.reminders.where("linkId").equals(linkId).first();
      if (reminder) {
        await db.reminders.delete(reminder.id);
      }
    });

    await get().refreshVault();

    pushToast({
      tone: "danger",
      title: "Link deleted"
    });
  },

  bulkDeleteLinks: async (linkIds) => {
    await db.transaction("rw", db.links, db.reminders, async () => {
      await db.links.bulkDelete(linkIds);
      await db.reminders.where("linkId").anyOf(linkIds).delete();
    });

    await get().refreshVault();

    pushToast({
      tone: "danger",
      title: `${linkIds.length} links deleted`
    });
  },

  bulkUpdateLinksMetadata: async (linkIds, updates) => {
    await db.transaction("rw", db.links, async () => {
      const links = await db.links.where("id").anyOf(linkIds).toArray();
      const updated = links.map((link) => {
        let categoryId = link.categoryId;
        if (updates.categoryId) {
          categoryId = updates.categoryId;
        }

        let tags = [...link.tags];
        if (updates.addTags && updates.addTags.length > 0) {
          tags = mergeUniqueStrings(tags, updates.addTags);
        }

        if (updates.removeTags && updates.removeTags.length > 0) {
          const toRemove = new Set(updates.removeTags.map((t) => t.toLowerCase()));
          tags = tags.filter((tag) => !toRemove.has(tag.toLowerCase()));
        }

        return {
          ...link,
          categoryId,
          tags: sanitizeTags(tags)
        };
      });

      await db.links.bulkPut(updated);
    });

    await get().refreshVault();

    pushToast({
      tone: "success",
      title: "Bulk edit applied",
      description: `Updated metadata for ${linkIds.length} links`
    });
  },

  toggleFavorite: async (linkId) => {
    const link = get().links.find((entry) => entry.id === linkId);
    if (!link) {
      return;
    }

    await db.links.update(linkId, {
      isFavorite: !link.isFavorite
    });

    await get().refreshVault();
  },

  recordVisit: async (linkId) => {
    const link = get().links.find((entry) => entry.id === linkId);
    if (!link) {
      return;
    }

    const nextVisits = link.visitCount + 1;
    if (link.maxVisits && nextVisits >= link.maxVisits) {
      await db.transaction("rw", db.links, db.reminders, async () => {
        await db.links.delete(linkId);
        const reminder = await db.reminders.where("linkId").equals(linkId).first();
        if (reminder) {
          await db.reminders.delete(reminder.id);
        }
      });
      await get().refreshVault();
      pushToast({
        tone: "warning",
        title: "Link self-destructed",
        description: `"${link.title}" hit its max visit limit (${link.maxVisits}) and was deleted.`
      });
    } else {
      // Track Reading Streak
      const todayStr = new Date().toISOString().split("T")[0];
      const lastRead = get().settings.lastReadDate || "";
      let streak = get().settings.readingStreak || 0;
      
      if (lastRead !== todayStr) {
        if (isYesterday(lastRead)) {
          streak += 1;
          pushToast({
            tone: "success",
            title: "Reading Streak Extended! 🎯",
            description: `You are on a ${streak}-day reading streak. Keep it up!`
          });
        } else {
          streak = 1;
          pushToast({
            tone: "success",
            title: "New Reading Streak Started! 📚",
            description: "Visit a link every day to build your streak."
          });
        }
        await get().updateSetting("lastReadDate", todayStr);
        await get().updateSetting("readingStreak", streak);
      }

      await db.links.update(linkId, {
        visitCount: nextVisits,
        lastVisited: Date.now()
      });
      await get().refreshVault();
    }
  },

  reorderLinks: async (orderedIds) => {
    const byId = new Map(get().links.map((link) => [link.id, link]));
    const reordered = orderedIds
      .map((id, index) => {
        const link = byId.get(id);
        if (!link) {
          return null;
        }

        return {
          ...link,
          order: index
        };
      })
      .filter((link): link is LinkRecord => Boolean(link));

    if (reordered.length === 0) {
      return;
    }

    await db.links.bulkPut(reordered);
    await get().refreshVault();
  },

  addCategory: async (draft) => {
    const name = draft.name.trim();
    if (!name) {
      return { ok: false, reason: "empty" };
    }

    const duplicate = get().categories.find(
      (category) => category.name.trim().toLowerCase() === name.toLowerCase()
    );
    if (duplicate) {
      pushToast({
        tone: "warning",
        title: "Category already exists",
        description: duplicate.name
      });
      return { ok: false, reason: "duplicate" };
    }

    let id = slugifyCategoryId(name);
    while (await db.categories.get(id)) {
      id = `${id}-${crypto.randomUUID().slice(0, 4)}`;
    }

    await db.categories.put({
      id,
      name,
      isDefault: false,
      color: draft.color,
      icon: draft.icon.trim() || "📌",
      createdAt: Date.now(),
      isSmart: draft.isSmart,
      rules: draft.rules,
      parentCategoryId: draft.parentCategoryId,
      workspaceId: draft.workspaceId || get().settings.activeWorkspaceId || "default"
    });

    await get().refreshVault();

    pushToast({
      tone: "success",
      title: draft.isSmart ? "Smart collection created" : "Category created",
      description: name
    });

    return { ok: true };
  },

  deleteCategory: async (categoryId) => {
    if (categoryId === "general") {
      pushToast({
        tone: "warning",
        title: "General category cannot be deleted"
      });
      return;
    }

    const generalId = getGeneralCategoryId(get().categories);

    await db.transaction("rw", db.categories, db.links, async () => {
      const linksToMove = await db.links.where("categoryId").equals(categoryId).toArray();
      await Promise.all(
        linksToMove.map((link) =>
          db.links.put({
            ...link,
            categoryId: generalId
          })
        )
      );
      await db.categories.delete(categoryId);
    });

    if (get().selectedCategoryId === categoryId) {
      set({ selectedCategoryId: null });
    }

    await get().refreshVault();
    pushToast({
      tone: "danger",
      title: "Category removed",
      description: "Links were moved to General."
    });
  },

  saveReminder: async (linkId, draft) => {
    const link = get().links.find((entry) => entry.id === linkId);
    if (!link) {
      return { ok: false, reason: "missing-link" };
    }

    if (draft.reminderType === "one-time" && draft.reminderTime <= Date.now()) {
      pushToast({
        tone: "warning",
        title: "Choose a future date",
        description: "One-time reminders must be scheduled in the future."
      });
      return { ok: false, reason: "past-date" };
    }

    const hasPermission = await ensureNotificationPermission();
    if (hasPermission !== get().settings.notificationsEnabled) {
      await get().updateSetting("notificationsEnabled", hasPermission);
    }

    const existing = get().reminders.find((reminder) => reminder.linkId === linkId);
    const reminder: ReminderRecord = {
      id: existing?.id ?? crypto.randomUUID(),
      linkId,
      reminderType: draft.reminderType,
      reminderTime: draft.reminderTime,
      nextTriggerAt: getNextReminderTrigger(draft.reminderTime, draft.reminderType),
      note: draft.note.trim(),
      createdAt: existing?.createdAt ?? Date.now()
    };

    await db.reminders.put(reminder);
    await get().refreshVault();

    pushToast({
      tone: hasPermission ? "success" : "warning",
      title: "Reminder saved",
      description: hasPermission
        ? `Reminder added for ${link.title}`
        : "Reminder saved. Enable browser notifications for alerts."
    });

    return { ok: true };
  },

  removeReminder: async (linkId) => {
    const reminder = get().reminders.find((entry) => entry.linkId === linkId);
    if (!reminder) {
      return;
    }

    await db.reminders.delete(reminder.id);
    await get().refreshVault();
  },

  processReminderDue: async (reminderId) => {
    const reminder = get().reminders.find((entry) => entry.id === reminderId);
    if (!reminder) {
      return;
    }

    if (reminder.reminderType === "one-time") {
      await db.reminders.delete(reminder.id);
    } else {
      let nextTriggerAt = reminder.nextTriggerAt;
      while (nextTriggerAt <= Date.now()) {
        nextTriggerAt = advanceReminderTime(nextTriggerAt, reminder.reminderType);
      }

      await db.reminders.put({
        ...reminder,
        nextTriggerAt
      });
    }

    await get().refreshVault();
  },

  exportVault: async (options) => {
    const snapshot = buildSnapshot({
      categories: get().categories,
      links: get().links,
      reminders: get().reminders,
      settings: {
        ...get().settings,
        appLocked: false
      }
    });

    const payload = await serializeSnapshot(snapshot, options);
    const date = new Date(snapshot.exportedAt).toISOString().slice(0, 10);
    const fileName = options?.encrypted
      ? `vaultx_backup_encrypted_${date}.json`
      : `vaultx_backup_${date}.json`;

    downloadTextFile(fileName, payload);
    pushToast({
      tone: "success",
      title: options?.encrypted ? "Encrypted backup exported" : "Vault exported",
      description: fileName
    });
  },

  importVault: async (rawText, options) => {
    const snapshot = await parseImportedSnapshot(rawText, options?.password);
    const mode = options?.mode ?? "merge";
    const summary: ImportSummary = {
      linksAdded: 0,
      linksMerged: 0,
      categoriesAdded: 0,
      remindersAdded: 0
    };

    await db.transaction("rw", db.links, db.categories, db.reminders, db.settings, async () => {
      if (mode === "replace") {
        await db.links.clear();
        await db.reminders.clear();
        await db.categories.clear();
        await db.settings.clear();
        await db.categories.bulkPut(createDefaultCategories());
        await db.settings.bulkPut(createDefaultSettingRecords());
      }

      const categories = await db.categories.toArray();
      const categoriesByName = new Map(
        categories.map((category) => [category.name.trim().toLowerCase(), category])
      );
      const categoryIdMap = new Map<string, string>();

      for (const importedCategory of snapshot.categories) {
        const name = importedCategory.name?.trim();
        if (!name) {
          continue;
        }

        const existing = categoriesByName.get(name.toLowerCase());
        if (existing) {
          categoryIdMap.set(importedCategory.id, existing.id);
          continue;
        }

        let id = importedCategory.id || slugifyCategoryId(name);
        while (await db.categories.get(id)) {
          id = `${slugifyCategoryId(name)}-${crypto.randomUUID().slice(0, 4)}`;
        }

        const category: CategoryRecord = {
          id,
          name,
          isDefault: Boolean(importedCategory.isDefault),
          color:
            importedCategory.color ||
            CATEGORY_SWATCHES[summary.categoriesAdded % CATEGORY_SWATCHES.length],
          icon: importedCategory.icon || "📌",
          createdAt:
            typeof importedCategory.createdAt === "number"
              ? importedCategory.createdAt
              : Date.now() + summary.categoriesAdded
        };

        await db.categories.put(category);
        categoriesByName.set(category.name.toLowerCase(), category);
        categoryIdMap.set(importedCategory.id, category.id);
        summary.categoriesAdded += 1;
      }

      const allCategories = await db.categories.toArray();
      const generalCategoryId = getGeneralCategoryId(allCategories);
      const links = await db.links.toArray();
      const linksByNormalized = new Map(links.map((link) => [link.normalizedUrl, link]));
      const linkIdMap = new Map<string, string>();
      let nextOrder = links.length === 0 ? 0 : Math.max(...links.map((link) => link.order)) + 1;

      for (const importedLink of snapshot.links) {
        const preparedUrl = ensureUrlProtocol(importedLink.url);
        const normalized = normalizeUrl(preparedUrl);
        if (!normalized) {
          continue;
        }

        const categoryId = categoryIdMap.get(importedLink.categoryId) ?? generalCategoryId;
        const existing = linksByNormalized.get(normalized);

        if (existing && mode === "merge") {
          const merged: LinkRecord = {
            ...existing,
            title: importedLink.title?.trim() || existing.title,
            categoryId,
            tags: mergeUniqueStrings(existing.tags, importedLink.tags ?? []),
            notes: importedLink.notes?.trim() || existing.notes,
            username: importedLink.username?.trim() || existing.username,
            password: importedLink.password?.trim() || existing.password,
            isFavorite: existing.isFavorite || Boolean(importedLink.isFavorite),
            visitCount: Math.max(existing.visitCount, importedLink.visitCount ?? 0),
            lastVisited:
              Math.max(existing.lastVisited ?? 0, importedLink.lastVisited ?? 0) || null
          };

          await db.links.put(merged);
          linkIdMap.set(importedLink.id, merged.id);
          summary.linksMerged += 1;
          continue;
        }

        let id = importedLink.id || crypto.randomUUID();
        while (await db.links.get(id)) {
          id = crypto.randomUUID();
        }

        const link: LinkRecord = {
          id,
          title: importedLink.title?.trim() || getDomain(preparedUrl),
          url: preparedUrl,
          normalizedUrl: normalized,
          categoryId,
          tags: sanitizeTags(importedLink.tags ?? []),
          notes: importedLink.notes?.trim() || "",
          username: importedLink.username?.trim() || undefined,
          password: importedLink.password?.trim() || undefined,
          isFavorite: Boolean(importedLink.isFavorite),
          createdAt:
            typeof importedLink.createdAt === "number" ? importedLink.createdAt : Date.now(),
          lastVisited:
            typeof importedLink.lastVisited === "number" ? importedLink.lastVisited : null,
          visitCount:
            typeof importedLink.visitCount === "number" ? importedLink.visitCount : 0,
          order:
            mode === "replace" && typeof importedLink.order === "number"
              ? importedLink.order
              : nextOrder++
        };

        await db.links.put(link);
        linksByNormalized.set(link.normalizedUrl, link);
        linkIdMap.set(importedLink.id, link.id);
        summary.linksAdded += 1;
      }

      const reminderByLinkId = new Map((await db.reminders.toArray()).map((reminder) => [reminder.linkId, reminder]));
      for (const importedReminder of snapshot.reminders) {
        const linkId = linkIdMap.get(importedReminder.linkId);
        if (!linkId) {
          continue;
        }

        const existing = reminderByLinkId.get(linkId);
        const reminderType = importedReminder.reminderType ?? "one-time";
        const reminderTime =
          typeof importedReminder.reminderTime === "number"
            ? importedReminder.reminderTime
            : Date.now();

        const reminder: ReminderRecord = {
          id: existing?.id ?? importedReminder.id ?? crypto.randomUUID(),
          linkId,
          reminderType,
          reminderTime,
          nextTriggerAt: getNextReminderTrigger(
            typeof importedReminder.nextTriggerAt === "number"
              ? importedReminder.nextTriggerAt
              : reminderTime,
            reminderType
          ),
          note: importedReminder.note?.trim() || "",
          createdAt:
            typeof importedReminder.createdAt === "number"
              ? importedReminder.createdAt
              : Date.now()
        };

        await db.reminders.put(reminder);
        reminderByLinkId.set(linkId, reminder);
        if (!existing) {
          summary.remindersAdded += 1;
        }
      }

      const currentSettings = settingsArrayToObject(await db.settings.toArray());
      const importedSettings: VaultSettings =
        mode === "replace"
          ? {
            ...DEFAULT_SETTINGS,
            ...snapshot.settings,
            appLocked: Boolean(snapshot.settings.pinEnabled && snapshot.settings.pinHash)
          }
          : {
            ...currentSettings,
            openInExternalBrowser: snapshot.settings.openInExternalBrowser,
            lockTimeoutSeconds: snapshot.settings.lockTimeoutSeconds,
            titleHistory: mergeUniqueStrings(
              currentSettings.titleHistory,
              snapshot.settings.titleHistory
            ).slice(0, 20),
            clipboardLastPromptUrl:
              snapshot.settings.clipboardLastPromptUrl || currentSettings.clipboardLastPromptUrl,
            notificationsEnabled:
              currentSettings.notificationsEnabled || snapshot.settings.notificationsEnabled,
            appLocked: currentSettings.appLocked
          };

      await db.settings.bulkPut(
        (
          Object.entries(importedSettings) as [keyof VaultSettings, VaultSettings[keyof VaultSettings]][]
        ).map(
          ([key, value], index) =>
            ({
              key,
              value,
              updatedAt: Date.now() + index
            }) satisfies SettingRecord
        )
      );
    });

    await get().refreshVault();

    if (options?.mode === "replace") {
      set({ searchQuery: "", selectedCategoryId: null, homeView: "all" });
    }

    pushToast({
      tone: "success",
      title: "Import complete",
      description: `${summary.linksAdded} links added, ${summary.linksMerged} merged`
    });

    return summary;
  },

  resetVault: async () => {
    await db.transaction("rw", db.links, db.categories, db.reminders, async () => {
      await db.links.clear();
      await db.reminders.clear();
      const customCategories = await db.categories.filter((category) => !category.isDefault).toArray();
      await db.categories.bulkDelete(customCategories.map((category) => category.id));
    });

    set({
      searchQuery: "",
      selectedCategoryId: null,
      homeView: "all"
    });

    await get().refreshVault();

    pushToast({
      tone: "danger",
      title: "Vault reset",
      description: "Links, reminders, and custom categories were removed."
    });
  },

  setPin: async (pin) => {
    const pinHash = await hashPin(pin);
    await persistSetting("pinHash", pinHash);
    await persistSetting("pinEnabled", true);

    set((state) => ({
      settings: {
        ...state.settings,
        pinHash,
        pinEnabled: true,
        appLocked: false
      }
    }));

    pushToast({
      tone: "success",
      title: "PIN protection enabled"
    });
  },

  clearPin: async () => {
    await persistSetting("pinHash", null);
    await persistSetting("pinEnabled", false);

    set((state) => ({
      settings: {
        ...state.settings,
        pinHash: null,
        pinEnabled: false,
        appLocked: false
      }
    }));

    pushToast({
      tone: "success",
      title: "PIN protection disabled"
    });
  },

  unlockVault: async (pin) => {
    const pinHash = get().settings.pinHash;
    if (!get().settings.pinEnabled || !pinHash) {
      set((state) => ({
        settings: {
          ...state.settings,
          appLocked: false
        }
      }));
      return true;
    }

    const valid = await verifyPin(pin, pinHash);
    if (valid) {
      set((state) => ({
        settings: {
          ...state.settings,
          appLocked: false
        }
      }));
    }
    return valid;
  },

  lockVault: () =>
    set((state) => ({
      settings: {
        ...state.settings,
        appLocked: state.settings.pinEnabled && Boolean(state.settings.pinHash)
      }
    }))
}));

function getLevenshteinDistance(a: string, b: string): number {
  const tmp: number[][] = [];
  let i, j;
  for (i = 0; i <= a.length; i++) {
    tmp.push([i]);
  }
  for (j = 1; j <= b.length; j++) {
    tmp[0].push(j);
  }
  for (i = 1; i <= a.length; i++) {
    for (j = 1; j <= b.length; j++) {
      tmp[i][j] = Math.min(
        tmp[i - 1][j] + 1,
        tmp[i][j - 1] + 1,
        tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return tmp[a.length][b.length];
}

function isFuzzyMatch(query: string, target: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase().trim();
  const t = target.toLowerCase().trim();
  
  if (t.includes(q)) return true;
  
  const qWords = q.split(/\s+/).filter(Boolean);
  const tWords = t.split(/[\s\-_\.\/]+/).filter(Boolean);
  
  return qWords.every(qw => {
    if (qw.length <= 3) {
      return tWords.some(tw => tw.includes(qw));
    }
    
    const maxDistance = qw.length <= 5 ? 1 : 2;
    return tWords.some(tw => {
      if (tw.includes(qw) || qw.includes(tw)) return true;
      
      if (Math.abs(tw.length - qw.length) <= maxDistance) {
        const dist = getLevenshteinDistance(qw, tw);
        if (dist <= maxDistance) return true;
      }
      return false;
    });
  });
}

function matchesSmartRules(
  link: LinkRecord,
  rules?: { tags?: string[]; query?: string; favoriteOnly?: boolean }
): boolean {
  if (!rules) return true;

  if (rules.tags && rules.tags.length > 0) {
    const hasAllTags = rules.tags.every((t) =>
      link.tags.some((lt) => lt.toLowerCase() === t.toLowerCase())
    );
    if (!hasAllTags) return false;
  }

  if (rules.query) {
    const q = rules.query.toLowerCase().trim();
    const matches =
      link.title.toLowerCase().includes(q) || link.url.toLowerCase().includes(q);
    if (!matches) return false;
  }

  if (rules.favoriteOnly && !link.isFavorite) {
    return false;
  }

  return true;
}

export function selectVisibleLinks(state: AppStore): LinkRecord[] {
  const query = state.searchQuery.trim().toLowerCase();
  const categoriesById = new Map(state.categories.map((category) => [category.id, category]));
  const selectedCategory = state.selectedCategoryId ? categoriesById.get(state.selectedCategoryId) : null;
  const activeWorkspace = state.settings.activeWorkspaceId || "default";

  const source =
    state.homeView === "favorites"
      ? state.links.filter((link) => link.isFavorite)
      : state.links;

  let workspaceSource = source.filter((link) => {
    const cat = categoriesById.get(link.categoryId);
    const linkWorkspace = link.workspaceId || "default";
    const catWorkspace = cat?.workspaceId || "default";
    return linkWorkspace === activeWorkspace || catWorkspace === activeWorkspace;
  });

  if (state.timeMachineDate) {
    const targetDate = state.timeMachineDate;
    workspaceSource = workspaceSource.filter((link) => {
      const linkDate = new Date(link.createdAt).toISOString().split("T")[0];
      return linkDate === targetDate;
    });
  }

  return workspaceSource.filter((link) => {
    const categoryName = categoriesById.get(link.categoryId)?.name.toLowerCase() ?? "";
    
    let matchesCategory = false;
    if (!state.selectedCategoryId) {
      matchesCategory = true;
    } else if (selectedCategory?.isSmart) {
      matchesCategory = matchesSmartRules(link, selectedCategory.rules);
    } else {
      matchesCategory = link.categoryId === state.selectedCategoryId;
    }
      
    if (!query) {
      return matchesCategory;
    }

    const matchesQuery =
      isFuzzyMatch(query, link.title) ||
      isFuzzyMatch(query, link.url) ||
      isFuzzyMatch(query, categoryName) ||
      link.tags.some((tag) => isFuzzyMatch(query, tag));

    return matchesCategory && matchesQuery;
  });
}

export function selectLinkCountsByCategory(state: AppStore): Map<string, number> {
  const counts = new Map<string, number>();
  const activeWorkspace = state.settings.activeWorkspaceId || "default";
  const categoriesById = new Map(state.categories.map((c) => [c.id, c]));

  const workspaceLinks = state.links.filter((link) => {
    const cat = categoriesById.get(link.categoryId);
    const linkWorkspace = link.workspaceId || "default";
    const catWorkspace = cat?.workspaceId || "default";
    return linkWorkspace === activeWorkspace || catWorkspace === activeWorkspace;
  });

  for (const category of state.categories) {
    counts.set(category.id, 0);
  }

  for (const category of state.categories) {
    if (category.isSmart) {
      let matchCount = 0;
      for (const link of workspaceLinks) {
        if (matchesSmartRules(link, category.rules)) {
          matchCount++;
        }
      }
      counts.set(category.id, matchCount);
    }
  }

  for (const link of workspaceLinks) {
    const catId = link.categoryId;
    const cat = categoriesById.get(catId);
    if (cat && !cat.isSmart) {
      counts.set(catId, (counts.get(catId) ?? 0) + 1);
    }
  }

  return counts;
}
