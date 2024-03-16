import type {
  DragEndEvent as DndDragEndEvent,
  DragMoveEvent as DndDragMoveEvent,
  DragStartEvent as DndDragStartEvent,
} from "@dnd-kit/core";

import type { DragActiveItem } from ".";

export interface DragStartEvent extends DndDragStartEvent {
  active: DragActiveItem;
}

export interface DragMoveEvent extends DndDragMoveEvent {
  active: DragActiveItem;
}

export interface DragEndEvent extends DndDragEndEvent {
  active: DragActiveItem;
}
