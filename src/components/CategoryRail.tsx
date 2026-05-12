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
                "flex h-9 items-center gap-2 px-3.5 rounded-full border text-[13px] font-semibold transition-colors duration-150 whitespace-nowrap shadow-sm",
                isActive
                  ? "bg-primary/10 border-primary/40 text-primary"
                  : "bg-background border-border text-muted-foreground hover:text-foreground hover:border-border/80"
              )}
            >
              <span className="text-sm">{category.icon}</span>
              <span>{category.name}</span>
              <span className={cn(
                "text-[11px] px-1.5 py-0.5 rounded-md font-bold ml-0.5",
                isActive ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground/80"
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
