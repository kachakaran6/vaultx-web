import { useMemo } from "react";
import { CategoryRail } from "../components/CategoryRail";
import { LinkList } from "../components/LinkList";
import { selectLinkCountsByCategory, selectVisibleLinks, useAppStore } from "../store/app-store";
import { PageHeader } from "../components/ui/PageHeader";

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
    <div className="flex-1 w-full animate-in fade-in duration-300">
      <div className="flex items-center gap-2 mb-6">
        <button 
          className={`flex items-center gap-2 px-3 h-8 rounded-md border text-xs font-medium transition-colors ${state.homeView === "all" ? "bg-accent text-surface border-accent shadow-sm" : "border-border text-text hover:bg-surface-2"}`}
          onClick={() => state.setHomeView("all")}
        >
          <span className="material-symbols-outlined text-[14px]">list</span>
          All
        </button>
        <button 
          className={`flex items-center gap-2 px-3 h-8 rounded-md border text-xs font-medium transition-colors ${state.homeView === "favorites" ? "bg-accent text-surface border-accent shadow-sm" : "border-border text-text hover:bg-surface-2"}`}
          onClick={() => state.setHomeView("favorites")}
        >
          <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: state.homeView === "favorites" ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
          Favorites
        </button>
      </div>

      {state.categories.length > 0 && (
        <div className="mb-6 flex-1 min-w-0 overflow-x-auto hide-scrollbar pb-2">
          <CategoryRail
            categories={state.categories}
            counts={linkCounts}
            selectedCategoryId={state.selectedCategoryId}
            onToggle={state.toggleCategoryFilter}
          />
        </div>
      )}

      {/* Main Listing Area */}
      <section className="min-h-[300px]">
        {visibleLinks.length === 0 ? (
          <div className="flex min-h-[300px] py-8 flex-col items-center justify-center text-center border border-dashed border-border bg-surface-2/50 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted mb-4 shadow-sm">
              <span className="material-symbols-outlined text-[24px]">layers</span>
            </div>
            <h2 className="text-lg font-semibold text-text tracking-tight">
              {hasFilter ? "No results found" : "Start building your vault"}
            </h2>
            <p className="mt-1 text-sm text-text-muted max-w-sm mx-auto leading-relaxed">
              {hasFilter
                ? "We couldn't find any links matching your active filters. Try searching for something else."
                : "Store articles, tools, and sites you love in one organized dashboard."}
            </p>
            <div className="mt-6">
              {hasFilter ? (
                <button 
                  onClick={state.clearFilters}
                  className="px-4 h-9 rounded-md border border-border text-text font-medium hover:bg-surface-2 transition-colors text-sm"
                >
                  Clear Filters
                </button>
              ) : (
                <button 
                  onClick={() => state.openAddDialog()}
                  className="px-4 h-9 rounded-md bg-accent text-surface font-medium hover:brightness-110 transition-colors flex items-center gap-2 text-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Add First Link
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {hasFilter && (
              <div className="flex items-center justify-between py-1 px-1">
                <span className="text-xs font-medium text-text-muted tracking-tight">
                  {state.searchQuery
                    ? `Search results for "${state.searchQuery}"`
                    : state.selectedCategoryId
                      ? `Category: ${categoriesById.get(state.selectedCategoryId)?.name}`
                      : "Favorite items"}
                </span>
                <button
                  type="button"
                  onClick={state.clearFilters}
                  className="text-xs font-semibold text-accent hover:underline"
                >
                  Reset Filters
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

      {/* Footer Summary Stats */}
      {visibleLinks.length > 0 && (
        <div className="mt-8 flex justify-center pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface rounded-full border border-border text-text-muted text-xs font-medium shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
              Showing {visibleLinks.length} of {state.links.length} links
          </div>
        </div>
      )}
    </div>
  );
}
