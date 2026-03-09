import type { CategoryRecord } from "../store/types";

export const VAULT_PALETTE = {
  background: "#0f0f14",
  card: "#1c1c24",
  elevated: "#22222d",
  surface: "#16161e",
  primary: "#3a86ff",
  secondary: "#8338ec",
  success: "#06d6a0",
  danger: "#ef476f",
  warning: "#ffbe0b",
  text: "#ffffff",
  muted: "#a0a0b0",
  hint: "#606070",
  border: "#2a2a38",
  divider: "#1e1e28"
} as const;

export const CATEGORY_SWATCHES = [
  "#3a86ff",
  "#8338ec",
  "#06d6a0",
  "#ef476f",
  "#ffbe0b",
  "#ff6b6b",
  "#4ecdc4",
  "#ff9f1c",
  "#2ec4b6",
  "#e71d36"
] as const;

const DEFAULT_CATEGORY_DEFS = [
  { id: "general", name: "General", icon: "🔗", color: "#3a86ff" },
  { id: "work", name: "Work", icon: "💼", color: "#8338ec" },
  { id: "learning", name: "Learning", icon: "📚", color: "#06d6a0" },
  { id: "entertainment", name: "Entertainment", icon: "🎬", color: "#ef476f" },
  { id: "shopping", name: "Shopping", icon: "🛒", color: "#ffbe0b" },
  { id: "social", name: "Social", icon: "💬", color: "#ff6b6b" },
  { id: "news", name: "News", icon: "📰", color: "#4ecdc4" },
  { id: "tools", name: "Tools", icon: "🛠", color: "#ff9f1c" }
] as const;

export function createDefaultCategories(now = Date.now()): CategoryRecord[] {
  return DEFAULT_CATEGORY_DEFS.map((category, index) => ({
    ...category,
    isDefault: true,
    createdAt: now + index
  }));
}

export function slugifyCategoryId(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || `category-${crypto.randomUUID().slice(0, 8)}`;
}
