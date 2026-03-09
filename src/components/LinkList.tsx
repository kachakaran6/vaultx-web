import { useMemo } from "react";
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
  onRemind
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
        dragging={isDragging}
        dragHandle={
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="mt-2 rounded-xl border border-vault-border bg-vault-elevated p-2 text-vault-hint"
          >
            <GripVertical size={15} />
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
  onReorder
}: LinkListProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const ids = useMemo(() => links.map((link) => link.id), [links]);

  if (!allowDrag) {
    return (
      <div className="space-y-3">
        {links.map((link) => (
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
          />
        ))}
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
        <div className="space-y-3">
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
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
