import type { DndContextProps, DragCancelEvent } from "@dnd-kit/core";
import type { CSSProperties, PropsWithChildren } from "react";

import type { UsePanStrategy } from "..";

import type { DragEndEvent, DragMoveEvent, DragStartEvent, Range } from ".";
import type {
	ResizeEndEvent,
	ResizeMoveEvent,
	ResizeStartEvent,
} from "./resize";

export interface PanEndEvent {
	clientX?: number;
	clientY?: number;
	deltaX: number;
	deltaY: number;
}

export type GetSpanFromDragEvent = (
	event: DragStartEvent | DragEndEvent | DragCancelEvent | DragMoveEvent,
) => Range | null;

export type GetSpanFromResizeEvent = (event: ResizeEndEvent) => Range | null;

export type GetValueFromScreenX = (screenX: number) => number;

export type GetDeltaXFromScreenX = (screenX: number) => number;

export type OnResizeStart = (event: ResizeStartEvent) => void;

export type OnResizeEnd = (event: ResizeEndEvent) => void;

export type OnResizeMove = (event: ResizeMoveEvent) => void;

export type OnPanEnd = (event: PanEndEvent) => void;

export type PixelsToValue = (pixels: number, range?: Range) => number;
export type ValueToPixels = (value: number, range?: Range) => number;

export interface TimelineBag {
	style: CSSProperties;
	range: Range;
	overlayed: boolean;
	onResizeEnd: OnResizeEnd;
	onResizeMove?: OnResizeMove;
	onResizeStart?: OnResizeStart;
	resizeHandleWidth: number;
	rangeGridSize?: number;
	direction: CanvasDirection;
	timelineRef: React.MutableRefObject<HTMLElement | null>;
	setTimelineRef: (element: HTMLElement | null) => void;
	sidebarWidth: number;
	isSidebarWidthControlled: boolean;
	sidebarRef: React.MutableRefObject<HTMLElement | null>;
	setSidebarRef: (element: HTMLElement | null) => void;
	valueToPixels: ValueToPixels;
	pixelsToValue: PixelsToValue;
	getValueFromScreenX: GetValueFromScreenX;
	getDeltaXFromScreenX: GetDeltaXFromScreenX;
	getSpanFromDragEvent: GetSpanFromDragEvent;
	getSpanFromResizeEvent: GetSpanFromResizeEvent;
	addResizeListener: <K extends keyof ResizeEvents>(
		event: K,
		callback: ResizeEvents[K],
	) => () => void;
}

export interface ResizeEvents {
	resizeStart: OnResizeStart;
	resizeMove: OnResizeMove;
	resizeEnd: OnResizeEnd;
}

export type OnRangeChanged = (updateFunction: (prev: Range) => Range) => void;

export interface GridSizeDefinition {
	value: number;
	maxRangeSize?: number;
}

export interface UseTimelineProps {
	range: Range;
	overlayed?: boolean;
	onResizeEnd: OnResizeEnd;
	resizeHandleWidth?: number;
	onResizeMove?: OnResizeMove;
	onResizeStart?: OnResizeStart;
	usePanStrategy?: UsePanStrategy;
	onRangeChanged: OnRangeChanged;
	rangeGridSizeDefinition?: number | GridSizeDefinition[];
	sidebarWidth?: number;
}

export interface TimelineContextProps
	extends PropsWithChildren,
		UseTimelineProps,
		DndContextProps {}
