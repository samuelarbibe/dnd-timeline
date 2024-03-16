import type { DragDirection, ResizeActiveItem } from ".";

export interface ResizeMoveEvent {
  active: ResizeActiveItem;
  delta: {
    x: number;
  };
  direction: DragDirection;
}

export type ResizeEndEvent = ResizeMoveEvent;

export interface ResizeStartEvent {
  active: ResizeActiveItem;
  direction: DragDirection;
}
