import type { CategoryRecord } from "../store/types";
import { cn } from "../utils/cn";

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
    <div className="overflow-x-auto no-scrollbar -mx-4 px-4 sm:-mx-1 sm:px-1">
      <div className="flex min-w-max gap-2 py-1">
        {sortedCategories.map((category) => {
          const isActive = selectedCategoryId === category.id;
          const count = counts.get(category.id) ?? 0;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onToggle(category.id)}
              className={cn(
                "flex h-8 items-center gap-2 px-3 rounded-md border text-xs font-semibold transition-colors duration-150 whitespace-nowrap shadow-sm",
                isActive
                  ? "bg-accent-soft border-accent/30 text-accent"
                  : "bg-surface border-border text-text-muted hover:text-text hover:bg-surface-2"
              )}
            >
              <span className="text-sm">{category.icon}</span>
              <span>{category.name}</span>
              <span className={cn(
                "text-[10px] px-1.5 py-0.5 rounded font-bold ml-0.5",
                isActive ? "bg-accent/20 text-accent" : "bg-surface-2 text-text-muted"
              )}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
