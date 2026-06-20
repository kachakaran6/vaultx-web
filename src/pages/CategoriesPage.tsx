import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "../components/SearchBar";
import { Button } from "../components/ui/button";
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
    <div className="space-y-6 animate-in fade-in duration-300 w-full">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <span className="text-xs font-semibold text-text-faint uppercase tracking-wider">
          {filteredCategories.length} Collections Available
        </span>
        <Button
          onClick={() => state.openCategoryDialog()}
          size="sm"
          className="h-8 text-xs px-3"
        >
          <span className="material-symbols-outlined mr-1.5 text-[16px]">add</span>
          Create Collection
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
              className="flex items-center justify-between p-4 bg-surface border border-border rounded-lg shadow-sm group cursor-pointer hover:shadow-md hover:border-accent/50 transition-all active:scale-[0.99] relative overflow-hidden"
            >
              <div 
                className="absolute inset-y-0 left-0 w-1"
                style={{ backgroundColor: category.color }}
              />
              
              <div className="flex items-center gap-4 min-w-0 pl-2">
                <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center text-xl shrink-0 border border-border">
                  {category.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-text tracking-tight truncate group-hover:text-accent transition-colors">{category.name}</h3>
                  <p className="text-xs text-text-muted font-medium mt-0.5">
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
                  className="p-2 rounded-md text-text-faint hover:text-danger hover:bg-danger/10 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {filteredCategories.length === 0 && (
        <div className="flex min-h-[300px] flex-col items-center justify-center text-center rounded-xl border border-dashed border-border bg-surface-2/50">
          <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted mb-4 shadow-sm">
            <span className="material-symbols-outlined text-[24px]">folder_off</span>
          </div>
          <p className="text-lg font-semibold text-text tracking-tight">No collections found</p>
          <p className="mt-1 text-sm text-text-muted">Create a new collection to organize your links.</p>
        </div>
      )}
    </div>
  );
}
