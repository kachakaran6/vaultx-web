import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "../components/SearchBar";
import { Button } from "../components/ui/Button";
import { selectLinkCountsByCategory, useAppStore } from "../store/app-store";

import { PageHeader } from "../components/ui/PageHeader";

export function CategoriesPage() {
  const navigate = useNavigate();
  const state = useAppStore();
  const linkCounts = selectLinkCountsByCategory(state);
  const [search, setSearch] = useState("");

  const filteredCategories = useMemo(() => {
    const list = state.categories.filter((cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase())
    );
    return list.sort((a, b) => (linkCounts.get(b.id) ?? 0) - (linkCounts.get(a.id) ?? 0));
  }, [state.categories, search, linkCounts]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Compact Category Utility Row */}
      <div className="flex items-center justify-between pb-2 border-b border-border/40">
        <span className="text-[12px] font-bold text-muted-foreground/60 uppercase tracking-wider">
          {filteredCategories.length} Collections Available
        </span>
        <Button
          onClick={() => state.openCategoryDialog()}
          leftIcon={<Plus size={14} />}
          size="sm"
          variant="secondary"
          className="h-8 text-[12px]"
        >
          Create Collection
        </Button>
      </div>

      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {filteredCategories.map((category) => {
          const count = linkCounts.get(category.id) ?? 0;
          return (
            <div
              key={category.id}
              onClick={() => {
                state.clearFilters();
                state.toggleCategoryFilter(category.id);
                navigate("/home");
              }}
              className="flex items-center justify-between p-5 bg-card border border-border rounded-lg shadow-sm group cursor-pointer hover:shadow-md hover:border-border/80 transition-all active:scale-[0.99] relative overflow-hidden"
            >
              <div 
                className="absolute inset-y-0 left-0 w-1"
                style={{ backgroundColor: category.color }}
              />
              
              <div className="flex items-center gap-4 min-w-0 pl-1">
                <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center text-xl shrink-0 border border-border/40">
                  {category.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="text-[15px] font-semibold text-foreground tracking-tight truncate group-hover:text-primary transition-colors">{category.name}</h3>
                  <p className="text-[12px] text-muted-foreground font-medium mt-0.5">
                    {count} {count === 1 ? "link" : "links"}
                  </p>
                </div>
              </div>

              {!category.isDefault && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Delete collection "${category.name}"? All items inside will remain safely in General.`)) {
                      void state.deleteCategory(category.id);
                    }
                  }}
                  className="p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {filteredCategories.length === 0 && (
        <div className="flex h-64 flex-col items-center justify-center text-center rounded-lg border border-dashed border-border bg-card/50">
          <p className="text-[14px] font-medium text-muted-foreground">No results found</p>
        </div>
      )}
    </div>
  );
}
