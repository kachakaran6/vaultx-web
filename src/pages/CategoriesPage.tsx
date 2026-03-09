import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "../components/SearchBar";
import { selectLinkCountsByCategory, useAppStore } from "../store/app-store";

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
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-vault-text">Categories</h1>
          <p className="mt-1 text-sm text-vault-muted">Organize your links into custom collections.</p>
        </div>
        <button
          type="button"
          onClick={() => state.openCategoryDialog()}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-vault-primary text-sm font-bold text-white shadow-subtle transition hover:opacity-90 active:scale-95"
        >
          <Plus size={18} strokeWidth={2.5} />
          Create Category
        </button>
      </header>

      <div className="max-w-md">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
              className="flex items-center justify-between p-4 rounded-xl border border-vault-border bg-vault-card group border-l-4 transition-all hover:border-vault-primary/40 cursor-pointer active:scale-[0.98]"
              style={{ borderLeftColor: category.color }}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="text-2xl shrink-0">{category.icon}</div>
                <div className="min-w-0">
                  <h3 className="font-bold text-vault-text truncate">{category.name}</h3>
                  <p className="text-xs text-vault-muted font-medium uppercase tracking-tighter">
                    {count} {count === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>

              {!category.isDefault && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Delete category "${category.name}"? Links will be moved to general.`)) {
                      void state.deleteCategory(category.id);
                    }
                  }}
                  className="p-2 rounded-lg text-vault-muted hover:text-vault-danger hover:bg-vault-danger/10 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {filteredCategories.length === 0 && (
        <div className="flex h-64 flex-col items-center justify-center text-center rounded-2xl border border-dashed border-vault-border bg-vault-card/30">
          <p className="text-sm text-vault-muted">No categories found.</p>
        </div>
      )}
    </div>
  );
}
