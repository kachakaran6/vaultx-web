import type { CategoryRecord } from "../store/types";

interface CategoryRailProps {
  categories: CategoryRecord[];
  counts: Map<string, number>;
  selectedCategoryId: string | null;
  onToggle: (categoryId: string) => void;
}

export function CategoryRail({
  categories,
  counts,
  selectedCategoryId,
  onToggle
}: CategoryRailProps) {
  const sortedCategories = [...categories].sort((a, b) => {
    const countDelta = (counts.get(b.id) ?? 0) - (counts.get(a.id) ?? 0);
    return countDelta !== 0 ? countDelta : a.name.localeCompare(b.name);
  });

  return (
    <div className="overflow-x-auto no-scrollbar pb-1">
      <div className="flex min-w-max gap-2">
        {sortedCategories.map((category) => {
          const isActive = selectedCategoryId === category.id;
          const count = counts.get(category.id) ?? 0;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onToggle(category.id)}
              className={`flex h-[36px] items-center gap-2 px-4 rounded-full border text-[13px] font-medium transition-all ${isActive
                  ? "bg-vault-elevated border-vault-primary text-vault-primary"
                  : "bg-vault-card border-vault-border text-vault-muted hover:text-vault-text hover:border-vault-muted/30"
                }`}
            >
              <span className="text-sm">{category.icon}</span>
              <span>{category.name}</span>
              <span className={`text-[11px] px-1.5 py-0.5 rounded-md font-bold ${isActive ? "bg-vault-primary/10" : "bg-vault-elevated text-vault-hint"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
