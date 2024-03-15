import type { CSSProperties, PropsWithChildren } from "react";
import type {
  Active,
  DndContextProps,
  DragCancelEvent,
  DragEndEvent,
  DragMoveEvent,
  DragStartEvent,
} from "@dnd-kit/core";

import type { UsePanStrategy } from "..";

import type { DragDirection, Relevance, Timeframe } from ".";

export interface ResizeMoveEvent {
  active: Omit<Active, "rect">;
  delta: {
    x: number;
  };
  direction: DragDirection;
}

export type ResizeEndEvent = ResizeMoveEvent;

export interface ResizeStartEvent {
  active: Omit<Active, "rect">;
  direction: DragDirection;
}

export interface PanEndEvent {
  clientX?: number;
  clientY?: number;
  deltaX: number;
  deltaY: number;
}

export type GetRelevanceFromDragEvent = (
  event: DragStartEvent | DragEndEvent | DragCancelEvent | DragMoveEvent,
) => Relevance | null;

export type GetRelevanceFromResizeEvent = (
  event: ResizeEndEvent,
) => Relevance | null;

export type GetDateFromScreenX = (screenX: number) => Date;

export type OnResizeStart = (event: ResizeStartEvent) => void;

export type OnResizeEnd = (event: ResizeEndEvent) => void;

export type OnResizeMove = (event: ResizeMoveEvent) => void;

export type OnPanEnd = (event: PanEndEvent) => void;

export type PixelsToMilliseconds = (
  pixels: number,
  timeframe?: Timeframe,
) => number;
export type MillisecondsToPixels = (
  milliseconds: number,
  timeframe?: Timeframe,
) => number;

export interface TimelineBag {
  style: CSSProperties;
  timeframe: Timeframe;
  overlayed: boolean;
  onResizeEnd: OnResizeEnd;
  onResizeMove?: OnResizeMove;
  onResizeStart?: OnResizeStart;
  resizeHandleWidth: number;
  timeframeGridSize?: number;
  timelineDirection: CanvasDirection;
  timelineRef: React.MutableRefObject<HTMLElement | null>;
  setTimelineRef: (element: HTMLElement | null) => void;
  sidebarWidth: number;
  sidebarRef: React.MutableRefObject<HTMLElement | null>;
  setSidebarRef: (element: HTMLElement | null) => void;
  millisecondsToPixels: MillisecondsToPixels;
  pixelsToMilliseconds: PixelsToMilliseconds;
  getDateFromScreenX: GetDateFromScreenX;
  getRelevanceFromDragEvent: GetRelevanceFromDragEvent;
  getRelevanceFromResizeEvent: GetRelevanceFromResizeEvent;
}

export type OnTimeframeChanged = (
  updateFunction: (prev: Timeframe) => Timeframe,
) => void;

export interface GridSizeDefinition {
  value: number;
  maxTimeframeSize?: number;
}

export interface UseTimelineProps {
  timeframe: Timeframe;
  overlayed?: boolean;
  onResizeEnd: OnResizeEnd;
  resizeHandleWidth?: number;
  onResizeMove?: OnResizeMove;
  onResizeStart?: OnResizeStart;
  usePanStrategy?: UsePanStrategy;
  onTimeframeChanged: OnTimeframeChanged;
  timeframeGridSizeDefinition?: number | GridSizeDefinition[];
}

export interface TimelineContextProps
  extends PropsWithChildren,
    UseTimelineProps,
    DndContextProps {}
