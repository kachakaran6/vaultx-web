import { useMemo } from "react";
import { Heart } from "lucide-react";
import { CategoryRail } from "../components/CategoryRail";
import { LinkList } from "../components/LinkList";
import { SearchBar } from "../components/SearchBar";
import { VaultOrb } from "../components/VaultOrb";
import { selectLinkCountsByCategory, selectVisibleLinks, useAppStore } from "../store/app-store";
import { VAULT_PALETTE } from "../utils/colors";

export function HomePage() {
  const state = useAppStore();
  const visibleLinks = selectVisibleLinks(state);
  const linkCounts = selectLinkCountsByCategory(state);
  const categoriesById = useMemo(
    () => new Map(state.categories.map((category) => [category.id, category])),
    [state.categories]
  );
  const remindersByLinkId = useMemo(
    () => new Map(state.reminders.map((reminder) => [reminder.linkId, reminder])),
    [state.reminders]
  );
  const hasFilter = Boolean(state.searchQuery || state.selectedCategoryId || state.homeView === "favorites");
  const allowDrag = state.homeView === "all" && !state.searchQuery && !state.selectedCategoryId;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-vault-text">All Links</h1>
          <p className="text-sm text-vault-muted mt-1">{state.links.length} items collected</p>
        </div>

        <div className="inline-flex h-10 items-center gap-1 rounded-xl bg-vault-card p-1 border border-vault-border">
          <button
            type="button"
            onClick={() => state.setHomeView("all")}
            className={`px-4 py-1.5 text-sm font-medium transition-all rounded-lg ${state.homeView === "all"
              ? "bg-vault-elevated text-vault-text border border-vault-border shadow-subtle"
              : "text-vault-muted hover:text-vault-text"
              }`}
          >
            All Links
          </button>
          <button
            type="button"
            onClick={() => state.setHomeView("favorites")}
            className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium transition-all rounded-lg ${state.homeView === "favorites"
              ? "bg-vault-elevated text-vault-text border border-vault-border shadow-subtle"
              : "text-vault-muted hover:text-vault-text"
              }`}
          >
            <Heart size={14} className={state.homeView === "favorites" ? "fill-vault-danger text-vault-danger" : ""} />
            Favorites
          </button>
        </div>
      </header>

      <div className="space-y-4">
        <SearchBar value={state.searchQuery} onChange={state.setSearchQuery} />

        {state.categories.length > 0 && (
          <CategoryRail
            categories={state.categories}
            counts={linkCounts}
            selectedCategoryId={state.selectedCategoryId}
            onToggle={state.toggleCategoryFilter}
          />
        )}
      </div>

      <section className="min-h-[400px]">
        {visibleLinks.length === 0 ? (
          <div className="flex h-[400px] flex-col items-center justify-center text-center rounded-3xl border border-dashed border-vault-border bg-vault-card/30">
            <div className="text-4xl opacity-50">{hasFilter ? "🔍" : "📦"}</div>
            <h2 className="mt-4 text-lg font-semibold text-vault-text">
              {hasFilter ? "No matches found" : "Your vault is empty"}
            </h2>
            <p className="mt-1 text-sm text-vault-muted max-w-xs mx-auto">
              {hasFilter
                ? "Try adjusting your search or filters to find what you're looking for."
                : "Start by adding your first link to your personal vault."}
            </p>
            {hasFilter ? (
              <button
                type="button"
                onClick={state.clearFilters}
                className="mt-6 rounded-xl border border-vault-border bg-vault-card px-4 py-2 text-sm font-medium text-vault-text hover:bg-vault-elevated transition"
              >
                Clear Filters
              </button>
            ) : (
              <button
                type="button"
                onClick={() => state.openAddDialog()}
                className="mt-6 rounded-xl bg-vault-primary px-6 py-2.5 text-sm font-bold text-white shadow-subtle hover:brightness-110 transition"
              >
                Add Link
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {hasFilter && (
              <div className="flex items-center justify-between py-1 border-b border-vault-border">
                <span className="text-xs font-bold uppercase tracking-wider text-vault-muted">
                  {state.searchQuery
                    ? `Results for "${state.searchQuery}"`
                    : state.selectedCategoryId
                      ? `Category: ${categoriesById.get(state.selectedCategoryId)?.name}`
                      : "Filtered Results"}
                </span>
                <button
                  type="button"
                  onClick={state.clearFilters}
                  className="text-xs font-bold text-vault-primary hover:underline"
                >
                  Clear all
                </button>
              </div>
            )}

            <LinkList
              links={visibleLinks}
              categoriesById={categoriesById}
              remindersByLinkId={remindersByLinkId}
              openInExternalBrowser={state.settings.openInExternalBrowser}
              allowDrag={allowDrag}
              onRecordVisit={(linkId) => {
                void state.recordVisit(linkId);
              }}
              onToggleFavorite={(linkId) => {
                void state.toggleFavorite(linkId);
              }}
              onEdit={(linkId) => state.openAddDialog(linkId)}
              onDelete={(linkId) => {
                const link = state.links.find((entry) => entry.id === linkId);
                if (link && window.confirm(`Delete "${link.title}"?`)) {
                  void state.deleteLink(linkId);
                }
              }}
              onRemind={(linkId) => state.openReminderDialog(linkId)}
              onReorder={(orderedIds) => {
                void state.reorderLinks(orderedIds);
              }}
            />
          </div>
        )}
      </section>

      <footer className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-vault-border">
        <div className="p-4 rounded-xl border border-vault-border bg-vault-card/50">
          <p className="text-[11px] font-bold text-vault-muted uppercase tracking-wider">Total Items</p>
          <p className="mt-1 text-2xl font-bold text-vault-text">{state.links.length}</p>
        </div>
        <div className="p-4 rounded-xl border border-vault-border bg-vault-card/50">
          <p className="text-[11px] font-bold text-vault-muted uppercase tracking-wider">Total Visits</p>
          <p className="mt-1 text-2xl font-bold text-vault-text">
            {state.links.reduce((sum, link) => sum + link.visitCount, 0)}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-vault-border bg-vault-card/50">
          <p className="text-[11px] font-bold text-vault-muted uppercase tracking-wider">Categories</p>
          <p className="mt-1 text-2xl font-bold text-vault-text">{state.categories.length}</p>
        </div>
      </footer>
    </div>
  );
}
