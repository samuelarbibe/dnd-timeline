import type { MutableRefObject } from "react";
import type { Active, Data } from "@dnd-kit/core";

import type {
  GetRelevanceFromDragEvent,
  GetRelevanceFromResizeEvent,
  Relevance,
  ResizeEndEvent,
  ResizeMoveEvent,
  ResizeStartEvent,
} from ".";

export type DragDirection = "start" | "end";

export interface ItemDefinition {
  id: string;
  rowId: string;
  disabled?: boolean;
  relevance: Relevance;
}

export interface UseItemProps
  extends Pick<ItemDefinition, "id" | "relevance" | "disabled"> {
  data?: object;
  onResizeEnd?: (event: ResizeEndEvent) => void;
  onResizeMove?: (event: ResizeMoveEvent) => void;
  onResizeStart?: (event: ResizeStartEvent) => void;
}

interface ItemDataBase extends Data {
  relevance: Relevance;
}

export interface DragItemData extends ItemDataBase {
  getRelevanceFromDragEvent?: GetRelevanceFromDragEvent;
}

export interface ResizeItemData extends ItemDataBase {
  getRelevanceFromResizeEvent?: GetRelevanceFromResizeEvent;
}

export interface ItemData extends DragItemData, ResizeItemData {}

export interface DragActiveItem extends Active {
  data: MutableRefObject<DragItemData>;
}

export interface ResizeActiveItem extends Omit<Active, "rect"> {
  data: MutableRefObject<ResizeItemData>;
}
