import { useMemo } from "react";
import { Heart, Layers, Plus } from "lucide-react";
import { CategoryRail } from "../components/CategoryRail";
import { LinkList } from "../components/LinkList";
import { SearchBar } from "../components/SearchBar";
import { Button } from "../components/ui/Button";
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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Unified Compact Filter Rail */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-2 border-b border-border/40">
        <div className="flex p-0.5 bg-secondary/80 rounded-lg border border-border/40 shadow-sm shrink-0 w-fit">
          <button
            type="button"
            onClick={() => state.setHomeView("all")}
            className={`px-3.5 h-[28px] text-[12px] font-semibold transition-all flex items-center gap-2 rounded-[6px] ${
              state.homeView === "all"
              ? "bg-card text-foreground shadow-sm border border-border/20"
              : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => state.setHomeView("favorites")}
            className={`px-3.5 h-[28px] text-[12px] font-semibold transition-all flex items-center gap-2 rounded-[6px] ${
              state.homeView === "favorites"
              ? "bg-card text-foreground shadow-sm border border-border/20"
              : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Heart size={12} className={state.homeView === "favorites" ? "fill-primary text-primary" : ""} />
            Favorites
          </button>
        </div>
        
        {state.categories.length > 0 && (
          <div className="flex-1 min-w-0 overflow-x-auto hide-scrollbar">
            <CategoryRail
              categories={state.categories}
              counts={linkCounts}
              selectedCategoryId={state.selectedCategoryId}
              onToggle={state.toggleCategoryFilter}
            />
          </div>
        )}
      </div>

      {/* Main Listing Area */}
      <section className="min-h-[300px]">
        {visibleLinks.length === 0 ? (
          <div className="flex min-h-[450px] py-12 flex-col items-center justify-center text-center border border-dashed border-border bg-card rounded-lg shadow-sm">
            <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mb-5">
              <Layers size={24} />
            </div>
            <h2 className="text-xl font-semibold text-foreground tracking-tight">
              {hasFilter ? "No results found" : "Start building your vault"}
            </h2>
            <p className="mt-2 text-[14px] text-muted-foreground max-w-sm mx-auto leading-relaxed">
              {hasFilter
                ? "We couldn't find any links matching your active filters. Try searching for something else."
                : "Store articles, tools, and sites you love in one organized dashboard."}
            </p>
            <div className="mt-8">
              {hasFilter ? (
                <Button variant="secondary" size="md" onClick={state.clearFilters}>
                  Clear Filters
                </Button>
              ) : (
                <Button variant="primary" size="lg" onClick={() => state.openAddDialog()} leftIcon={<Plus size={20} />}>
                  Add First Link
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {hasFilter && (
              <div className="flex items-center justify-between py-2 px-1">
                <span className="text-[12px] font-medium text-muted-foreground tracking-tight">
                  {state.searchQuery
                    ? `Search results for "${state.searchQuery}"`
                    : state.selectedCategoryId
                      ? `Category: ${categoriesById.get(state.selectedCategoryId)?.name}`
                      : "Favorite items"}
                </span>
                <button
                  type="button"
                  onClick={state.clearFilters}
                  className="text-xs font-semibold text-primary hover:underline"
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

      {/* Compact Footer Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-6 border-t border-border/40">
        <div className="bg-card p-5 rounded-lg border border-border shadow-sm flex flex-col">
          <span className="text-[12px] font-medium text-muted-foreground mb-1">Active Links</span>
          <span className="text-xl font-bold tracking-tight">{state.links.length}</span>
        </div>
        <div className="bg-card p-5 rounded-lg border border-border shadow-sm flex flex-col">
          <span className="text-[12px] font-medium text-muted-foreground mb-1">Total Visits</span>
          <span className="text-xl font-bold tracking-tight">{state.links.reduce((sum, link) => sum + link.visitCount, 0)}</span>
        </div>
        <div className="bg-card p-5 rounded-lg border border-border shadow-sm flex flex-col">
          <span className="text-[12px] font-medium text-muted-foreground mb-1">Collections</span>
          <span className="text-xl font-bold tracking-tight">{state.categories.length}</span>
        </div>
      </div>
    </div>
  );
}
