import type {
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
