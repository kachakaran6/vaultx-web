import { useMemo, useState } from "react";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { LinkCard } from "./LinkCard";
import type { CategoryRecord, LinkRecord, ReminderRecord } from "../store/types";
import { pushToast } from "../store/toast-store";

interface LinkListProps {
  links: LinkRecord[];
  categoriesById: Map<string, CategoryRecord>;
  remindersByLinkId: Map<string, ReminderRecord>;
  openInExternalBrowser: boolean;
  allowDrag: boolean;
  onRecordVisit: (linkId: string) => void;
  onToggleFavorite: (linkId: string) => void;
  onEdit: (linkId: string) => void;
  onDelete: (linkId: string) => void;
  onRemind: (linkId: string) => void;
  onReorder: (orderedIds: string[]) => void;
  viewMode?: "list" | "grid" | "table" | "compact";
  selectedIds?: Set<string>;
  onSelectLink?: (linkId: string, selected: boolean) => void;
  selectionMode?: boolean;
  tableColumns?: {
    category: boolean;
    visits: boolean;
    actions: boolean;
    url: boolean;
    notes: boolean;
    tags: boolean;
    username: boolean;
    password: boolean;
  };
}

function SortableItem({
  link,
  categoriesById,
  remindersByLinkId,
  openInExternalBrowser,
  onRecordVisit,
  onToggleFavorite,
  onEdit,
  onDelete,
  onRemind,
  viewMode,
  selectedIds,
  onSelectLink,
  selectionMode
}: Omit<LinkListProps, "links" | "allowDrag" | "onReorder"> & { link: LinkRecord }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: link.id
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition
      }}
    >
      <LinkCard
        link={link}
        category={categoriesById.get(link.categoryId)}
        hasReminder={remindersByLinkId.has(link.id)}
        openInExternalBrowser={openInExternalBrowser}
        onFavorite={() => onToggleFavorite(link.id)}
        onEdit={() => onEdit(link.id)}
        onDelete={() => onDelete(link.id)}
        onRemind={() => onRemind(link.id)}
        onRecordVisit={() => onRecordVisit(link.id)}
        viewMode={viewMode}
        selectionMode={selectionMode}
        selected={selectedIds?.has(link.id)}
        onSelect={(selected) => onSelectLink?.(link.id, selected)}
        dragging={isDragging}
        dragHandle={
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="mt-2 rounded-md border border-border bg-surface-2 p-2 text-text-faint hover:text-text cursor-grab active:cursor-grabbing transition-colors"
          >
            <GripVertical size={16} />
          </button>
        }
      />
    </div>
  );
}

export function LinkList({
  links,
  categoriesById,
  remindersByLinkId,
  openInExternalBrowser,
  allowDrag,
  onRecordVisit,
  onToggleFavorite,
  onEdit,
  onDelete,
  onRemind,
  onReorder,
  viewMode = "list",
  selectedIds,
  onSelectLink,
  selectionMode = false,
  tableColumns = { category: true, visits: true, actions: true }
}: LinkListProps) {
  const [showPasswords, setShowPasswords] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const ids = useMemo(() => links.map((link) => link.id), [links]);

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      pushToast({ tone: "success", title: "Copied!", description: `${type} copied to clipboard.` });
    } catch (e) {
      pushToast({ tone: "danger", title: "Failed to copy" });
    }
  };

  const getContainerClass = () => {
    if (viewMode === "grid") return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4";
    return "space-y-3";
  };

  const renderItem = (link: LinkRecord) => (
    <LinkCard
      key={link.id}
      link={link}
      category={categoriesById.get(link.categoryId)}
      hasReminder={remindersByLinkId.has(link.id)}
      openInExternalBrowser={openInExternalBrowser}
      onFavorite={() => onToggleFavorite(link.id)}
      onEdit={() => onEdit(link.id)}
      onDelete={() => onDelete(link.id)}
      onRemind={() => onRemind(link.id)}
      onRecordVisit={() => onRecordVisit(link.id)}
      viewMode={viewMode}
      selectionMode={selectionMode}
      selected={selectedIds?.has(link.id)}
      onSelect={(selected) => onSelectLink?.(link.id, selected)}
    />
  );

  if (viewMode === "table") {
    return (
      <div className="w-full overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-surface-2 text-text-muted">
            <tr>
              {selectionMode && <th className="px-4 py-3 w-10"></th>}
              <th className="px-4 py-3 font-semibold">Title</th>
              {tableColumns.url && <th className="px-4 py-3 font-semibold">URL</th>}
              {tableColumns.category && <th className="px-4 py-3 font-semibold">Category</th>}
              {tableColumns.tags && <th className="px-4 py-3 font-semibold">Tags</th>}
              {tableColumns.notes && <th className="px-4 py-3 font-semibold">Notes</th>}
              {tableColumns.username && <th className="px-4 py-3 font-semibold">Username</th>}
              {tableColumns.password && (
                <th className="px-4 py-3 font-semibold">
                  <div className="flex items-center gap-2">
                    Password
                    <button 
                      onClick={() => setShowPasswords(!showPasswords)}
                      className="text-text-muted hover:text-text transition-colors flex items-center justify-center"
                      title={showPasswords ? "Hide Passwords" : "Show Passwords"}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {showPasswords ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </th>
              )}
              {tableColumns.visits && <th className="px-4 py-3 font-semibold">Visits</th>}
              {tableColumns.actions && <th className="px-4 py-3 font-semibold text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {links.map(link => (
              <tr key={link.id} className="hover:bg-surface-2/30 transition-colors group">
                {selectionMode && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds?.has(link.id)}
                      onChange={(e) => onSelectLink?.(link.id, e.target.checked)}
                      className="w-4 h-4 accent-accent cursor-pointer"
                    />
                  </td>
                )}
                <td className="px-4 py-3 font-medium text-text">
                  <div className="flex items-center gap-2">
                    <a href={link.url} target={openInExternalBrowser ? "_blank" : "_self"} className="hover:text-accent hover:underline" onClick={() => onRecordVisit(link.id)}>
                      {link.title}
                    </a>
                  </div>
                </td>
                {tableColumns.url && (
                  <td className="px-4 py-3 text-text-muted truncate max-w-[150px]" title={link.url}>
                    {link.url}
                  </td>
                )}
                {tableColumns.category && (
                  <td className="px-4 py-3 text-text-muted">
                    {categoriesById.get(link.categoryId)?.name || "General"}
                  </td>
                )}
                {tableColumns.tags && (
                  <td className="px-4 py-3 text-text-muted">
                    <div className="flex flex-wrap gap-1">
                      {link.tags?.map(tag => (
                        <span key={tag} className="text-[10px] bg-surface-2 px-1.5 py-0.5 rounded border border-border/50">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                )}
                {tableColumns.notes && (
                  <td className="px-4 py-3 text-text-muted truncate max-w-[200px]" title={link.notes}>
                    {link.notes}
                  </td>
                )}
                {tableColumns.username && (
                  <td className="px-4 py-3 text-text-muted">
                    {link.username ? (
                      <span 
                        className="font-mono text-xs bg-surface-2 px-1.5 py-0.5 rounded cursor-pointer hover:bg-surface-2/80 transition-colors"
                        onClick={() => handleCopy(link.username!, "Username")}
                        title="Click to copy"
                      >
                        {link.username}
                      </span>
                    ) : "-"}
                  </td>
                )}
                {tableColumns.password && (
                  <td className="px-4 py-3 text-text-muted">
                    {link.password ? (
                      <span 
                        className="font-mono text-xs bg-surface-2 px-1.5 py-0.5 rounded cursor-pointer hover:bg-surface-2/80 transition-colors"
                        onClick={() => handleCopy(link.password!, "Password")}
                        title="Click to copy"
                      >
                        {showPasswords ? link.password : "••••••••"}
                      </span>
                    ) : "-"}
                  </td>
                )}
                {tableColumns.visits && <td className="px-4 py-3 text-text-faint">{link.visitCount}</td>}
                {tableColumns.actions && (
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button type="button" onClick={() => onToggleFavorite(link.id)} className="text-text-muted hover:text-text">
                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: link.isFavorite ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                      </button>
                      <button type="button" onClick={() => onEdit(link.id)} className="text-text-muted hover:text-text">
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!allowDrag) {
    return (
      <div className={getContainerClass()}>
        {links.map((link) => renderItem(link))}
      </div>
    );
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    onReorder(arrayMove(ids, oldIndex, newIndex));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className={getContainerClass()}>
          {links.map((link) => (
            <SortableItem
              key={link.id}
              link={link}
              categoriesById={categoriesById}
              remindersByLinkId={remindersByLinkId}
              openInExternalBrowser={openInExternalBrowser}
              onRecordVisit={onRecordVisit}
              onToggleFavorite={onToggleFavorite}
              onEdit={onEdit}
              onDelete={onDelete}
              onRemind={onRemind}
              viewMode={viewMode}
              selectedIds={selectedIds}
              onSelectLink={onSelectLink}
              selectionMode={selectionMode}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
