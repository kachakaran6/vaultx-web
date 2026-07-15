import { useMemo } from "react";
import { CategoryRail } from "../components/CategoryRail";
import { LinkList } from "../components/LinkList";
import { selectLinkCountsByCategory, selectVisibleLinks, useAppStore } from "../store/app-store";
import { PageHeader } from "../components/ui/PageHeader";
import { useState } from "react";
import { encodeSharedLinks } from "../utils/share";
import { pushToast } from "../store/toast-store";
import { BulkEditDialog } from "../components/BulkEditDialog";
import { ReaderModeDialog } from "../components/ReaderModeDialog";
import type { LinkRecord } from "../store/types";
import { KanbanBoard } from "../components/KanbanBoard";
import { exportCategoryPortfolio } from "../utils/export";

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
  
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBulkEditDialog, setShowBulkEditDialog] = useState(false);
  const [readerLink, setReaderLink] = useState<LinkRecord | null>(null);
  
  const [tableColumns, setTableColumns] = useState({
    url: false,
    category: true,
    tags: false,
    notes: false,
    username: false,
    password: false,
    visits: true,
    actions: true
  });
  const [showColumnMenu, setShowColumnMenu] = useState(false);

  const allowDrag = state.homeView === "all" && !state.searchQuery && !state.selectedCategoryId && state.settings.viewMode === "list" && !selectionMode;

  const handleSelectLink = (linkId: string, selected: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (selected) next.add(linkId);
      else next.delete(linkId);
      return next;
    });
  };

  const handleShareSelected = async () => {
    if (selectedIds.size === 0) return;
    const selectedLinks = state.links.filter(link => selectedIds.has(link.id));
    try {
      const payload = await encodeSharedLinks(selectedLinks);
      const shareUrl = `${window.location.origin}${window.location.pathname}#import=${payload}`;
      await navigator.clipboard.writeText(shareUrl);
      pushToast({ tone: "success", title: "Share Link Copied", description: "The link has been copied to your clipboard." });
      setSelectionMode(false);
      setSelectedIds(new Set());
    } catch (e) {
      pushToast({ tone: "danger", title: "Failed to generate share link" });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (window.confirm(`Delete ${selectedIds.size} links permanently?`)) {
      await state.bulkDeleteLinks(Array.from(selectedIds));
      setSelectedIds(new Set());
      setSelectionMode(false);
    }
  };

  return (
    <div className="flex-1 w-full animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
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
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {selectionMode ? (
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1">
              <button
                className="px-3 h-8 text-xs font-medium border border-border rounded-md hover:bg-surface-2 transition-colors whitespace-nowrap"
                onClick={() => { setSelectionMode(false); setSelectedIds(new Set()); }}
              >
                Cancel
              </button>
              <button
                className="px-3 h-8 text-xs font-medium border border-border rounded-md hover:bg-surface-2 transition-colors whitespace-nowrap"
                onClick={() => {
                  if (selectedIds.size === visibleLinks.length) {
                    setSelectedIds(new Set());
                  } else {
                    setSelectedIds(new Set(visibleLinks.map(l => l.id)));
                  }
                }}
              >
                {selectedIds.size === visibleLinks.length ? "Deselect All" : "Select All"}
              </button>
              <button
                className="flex items-center gap-2 px-3 h-8 text-xs font-medium bg-accent text-surface rounded-md disabled:opacity-50 transition-colors whitespace-nowrap cursor-pointer hover:brightness-110"
                disabled={selectedIds.size === 0}
                onClick={handleShareSelected}
              >
                <span className="material-symbols-outlined text-[14px]">share</span>
                Share ({selectedIds.size})
              </button>
              <button
                className="flex items-center gap-2 px-3 h-8 text-xs font-medium bg-surface border border-border text-text hover:bg-surface-2 rounded-md disabled:opacity-50 transition-colors whitespace-nowrap cursor-pointer"
                disabled={selectedIds.size === 0}
                onClick={() => setShowBulkEditDialog(true)}
              >
                <span className="material-symbols-outlined text-[14px]">edit</span>
                Edit ({selectedIds.size})
              </button>
              <button
                className="flex items-center gap-2 px-3 h-8 text-xs font-medium bg-red-600 text-white rounded-md disabled:opacity-50 transition-colors whitespace-nowrap cursor-pointer hover:bg-red-700"
                disabled={selectedIds.size === 0}
                onClick={handleBulkDelete}
              >
                <span className="material-symbols-outlined text-[14px]">delete</span>
                Delete ({selectedIds.size})
              </button>
            </div>
          ) : (
            <button
              className="flex items-center gap-1.5 px-3 h-8 text-xs font-medium text-text-muted hover:text-text border border-transparent hover:border-border rounded-md transition-colors"
              onClick={() => setSelectionMode(true)}
            >
              <span className="material-symbols-outlined text-[16px]">check_box</span>
              Select
            </button>
          )}

          {/* Time Machine Date Picker */}
          <div className="flex items-center gap-1 bg-surface border border-border rounded-md px-2 h-8 shadow-sm">
            <span className="material-symbols-outlined text-[15px] text-text-muted">calendar_month</span>
            <input
              type="date"
              value={state.timeMachineDate || ""}
              onChange={(e) => state.setTimeMachineDate(e.target.value || null)}
              className="bg-transparent border-none text-[11px] font-semibold text-text outline-none cursor-pointer focus:ring-0 max-w-[110px] p-0"
              title="Time Machine: View items by date"
            />
            {state.timeMachineDate && (
              <button 
                onClick={() => state.setTimeMachineDate(null)}
                className="text-text-muted hover:text-text p-0.5"
                title="Clear date filter"
              >
                <span className="material-symbols-outlined text-[13px]">close</span>
              </button>
            )}
          </div>

          {/* Portfolio Exporter */}
          {state.selectedCategoryId && (
            <button
              onClick={() => {
                const category = categoriesById.get(state.selectedCategoryId!);
                if (category) {
                  exportCategoryPortfolio(category.name, visibleLinks);
                  pushToast({
                    tone: "success",
                    title: "Portfolio Generated! 📖",
                    description: `Downloaded Markdown dossier for ${category.name} collection.`
                  });
                }
              }}
              className="flex items-center justify-center gap-1.5 px-3 h-8 border border-border hover:bg-surface-2 rounded-md text-xs font-semibold text-text shadow-sm"
              title="Export collection as Markdown Portfolio Dossier"
            >
              <span className="material-symbols-outlined text-[15px]">summarize</span>
              <span>Export Dossier</span>
            </button>
          )}

          <div className="w-px h-6 bg-border mx-1"></div>

          <div className="flex items-center bg-surface border border-border rounded-md relative shadow-sm">
            <div className="flex items-center overflow-hidden">
              {[
                { id: "list", icon: "view_list" },
                { id: "grid", icon: "grid_view" },
                { id: "kanban", icon: "view_week" },
                { id: "table", icon: "table_rows" },
                { id: "compact", icon: "view_headline" }
              ].map((view) => (
                <button
                  key={view.id}
                  onClick={() => state.updateSetting("viewMode", view.id as any)}
                  className={`w-8 h-8 flex items-center justify-center transition-colors ${state.settings.viewMode === view.id ? "bg-accent/10 text-accent" : "text-text-muted hover:text-text hover:bg-surface-2"}`}
                  title={`Switch to ${view.id} view`}
                >
                  <span className="material-symbols-outlined text-[16px]">{view.icon}</span>
                </button>
              ))}
            </div>
            
            {state.settings.viewMode === "table" && (
              <div className="relative border-l border-border">
                <button
                  className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-2 transition-colors"
                  onClick={() => setShowColumnMenu(!showColumnMenu)}
                  title="Select Columns"
                >
                  <span className="material-symbols-outlined text-[16px]">view_column</span>
                </button>
                
                {showColumnMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-border rounded-lg shadow-xl z-50 py-1" onMouseLeave={() => setShowColumnMenu(false)}>
                    <div className="px-3 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">Visible Columns</div>
                    {(Object.keys(tableColumns) as Array<keyof typeof tableColumns>).map((col) => (
                      <label key={col} className="flex items-center gap-3 px-3 py-2 hover:bg-surface-2 cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          checked={tableColumns[col]} 
                          onChange={(e) => setTableColumns(prev => ({ ...prev, [col]: e.target.checked }))}
                          className="w-4 h-4 accent-accent rounded border-border"
                        />
                        <span className="text-sm text-text capitalize">{col}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {state.categories.length > 0 && (
        <div className="mb-6 flex-1 min-w-0 pb-1">
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

            {state.settings.viewMode === "kanban" ? (
              <KanbanBoard
                links={visibleLinks}
                onOpenReader={(link) => setReaderLink(link)}
              />
            ) : (
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
                onReadMode={(linkId) => {
                  const found = state.links.find((entry) => entry.id === linkId);
                  if (found) setReaderLink(found);
                }}
                viewMode={state.settings.viewMode}
                selectionMode={selectionMode}
                selectedIds={selectedIds}
                onSelectLink={handleSelectLink}
                tableColumns={tableColumns}
              />
            )}
          </div>
        )}
      </section>

      {/* Footer Summary Stats */}
      {visibleLinks.length > 0 && (
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface rounded-full border border-border text-text-muted text-xs font-medium shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
              Showing {visibleLinks.length} of {state.links.length} links
          </div>
        </div>
      )}

      <BulkEditDialog
        open={showBulkEditDialog}
        onClose={() => setShowBulkEditDialog(false)}
        selectedIds={selectedIds}
        onSuccess={() => {
          setSelectedIds(new Set());
          setSelectionMode(false);
        }}
      />

      <ReaderModeDialog
        open={readerLink !== null}
        link={readerLink}
        onClose={() => setReaderLink(null)}
      />
    </div>
  );
}
