import type { DragDirection, ResizeActiveItem } from ".";

export interface ResizeMoveEvent {
	activatorEvent: Event;
	active: ResizeActiveItem;
	delta: {
		x: number;
	};
	direction: DragDirection;
}

export type ResizeEndEvent = ResizeMoveEvent;

export interface ResizeStartEvent {
	activatorEvent: Event;
	active: ResizeActiveItem;
	direction: DragDirection;
}
