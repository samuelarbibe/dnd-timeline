import type { CSSProperties } from "react";
import { useRef, useMemo, useState, useCallback } from "react";
import ResizeObserver from "resize-observer-polyfill";
import type {
  Active,
  DragEndEvent,
  DragMoveEvent,
  DragStartEvent,
  DragCancelEvent,
} from "@dnd-kit/core";
import { useDndMonitor } from "@dnd-kit/core";
import { addMilliseconds, differenceInMilliseconds } from "date-fns";
import type { Relevance, Timeframe } from "../types";
import type { UsePanStrategy } from "../utils/panStrategies";
import { useWheelStrategy } from "../utils/panStrategies";
import type { DragDirection } from "./useItem";

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

export type PixelsToMilliseconds = (pixels: number) => number;
export type MillisecondsToPixels = (milliseconds: number) => number;

export interface TimelineBag {
  style: CSSProperties;
  timeframe: Timeframe;
  overlayed: boolean;
  sidebarWidth: number;
  onResizeEnd: OnResizeEnd;
  onResizeMove?: OnResizeMove;
  onResizeStart?: OnResizeStart;
  timeframeGridSize?: number;
  timelineDirection: CanvasDirection;
  timelineRef: React.MutableRefObject<HTMLElement | null>;
  setTimelineRef: (element: HTMLElement | null) => void;
  setSidebarWidth: React.Dispatch<React.SetStateAction<number>>;
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
  onResizeMove?: OnResizeMove;
  onResizeStart?: OnResizeStart;
  usePanStrategy?: UsePanStrategy;
  onTimeframeChanged: OnTimeframeChanged;
  timeframeGridSizeDefinition?: number | GridSizeDefinition[];
}

const style: CSSProperties = {
  display: "flex",
  overflow: "hidden",
  position: "relative",
  flexDirection: "column",
};

function useTimelineRef() {
  const ref = useRef<HTMLElement | null>(null);
  const [width, setWidth] = useState(0);
  const [direction, setDirection] = useState<CanvasDirection>("ltr");

  const resizeObserver = useRef<ResizeObserver>();

  const setRef = useCallback((element: HTMLElement | null) => {
    if (element !== ref.current) {
      resizeObserver.current?.disconnect();

      if (element) {
        resizeObserver.current = new ResizeObserver((entries) => {
          for (const entry of entries) {
            setWidth(entry.contentRect.width);
          }
        });

        resizeObserver.current.observe(element);

        setDirection(getComputedStyle(element).direction as CanvasDirection);
      }
    }
    ref.current = element;
  }, []);

  return {
    ref,
    setRef,
    width,
    direction,
  };
}

export default function useTimeline({
  timeframe,
  onResizeEnd,
  onResizeStart,
  onResizeMove,
  overlayed = false,
  onTimeframeChanged,
  timeframeGridSizeDefinition,
  usePanStrategy = useWheelStrategy,
}: UseTimelineProps): TimelineBag {
  const [sidebarWidth, setSidebarWidth] = useState(0);
  const dragStartTimeframe = useRef<Timeframe>(timeframe);

  const {
    ref: timelineRef,
    setRef: setTimelineRef,
    width: timelineWidth,
    direction: timelineDirection,
  } = useTimelineRef();

  const timelineViewportWidth = timelineWidth - sidebarWidth;

  const timeframeGridSize = useMemo(() => {
    if (Array.isArray(timeframeGridSizeDefinition)) {
      const gridSizes = timeframeGridSizeDefinition;

      const timeframeSize = timeframe.end.getTime() - timeframe.start.getTime();

      const sortedTimeframeGridSizes = [...gridSizes];
      sortedTimeframeGridSizes.sort((a, b) => a.value - b.value);

      return sortedTimeframeGridSizes.find(
        (curr) =>
          !curr.maxTimeframeSize || timeframeSize < curr.maxTimeframeSize,
      )?.value;
    }

    return timeframeGridSizeDefinition;
  }, [timeframe, timeframeGridSizeDefinition]);

  const millisecondsToPixels = useCallback<MillisecondsToPixels>(
    (milliseconds: number) => {
      const msToPixel =
        timelineViewportWidth /
        differenceInMilliseconds(timeframe.end, timeframe.start);
      return milliseconds * msToPixel;
    },
    [timelineViewportWidth, timeframe],
  );

  const pixelsToMilliseconds = useCallback<PixelsToMilliseconds>(
    (pixels: number) => {
      const pixelToMs =
        differenceInMilliseconds(timeframe.end, timeframe.start) /
        timelineViewportWidth;
      return pixels * pixelToMs;
    },
    [timeframe, timelineViewportWidth],
  );

  const snapDateToTimeframeGrid = useCallback(
    (date: Date) => {
      if (!timeframeGridSize) return date;

      return new Date(
        Math.round(date.getTime() / timeframeGridSize) * timeframeGridSize,
      );
    },
    [timeframeGridSize],
  );

  const getDateFromScreenX = useCallback<GetDateFromScreenX>(
    (screenX) => {
      const side = timelineDirection === "rtl" ? "right" : "left";

      const timelineSideX =
        (timelineRef.current?.getBoundingClientRect()[side] || 0) +
        sidebarWidth * (timelineDirection === "rtl" ? -1 : 1);

      const deltaX = screenX - timelineSideX;

      const deltaInMilliseconds =
        pixelsToMilliseconds(deltaX) * (timelineDirection === "rtl" ? -1 : 1);

      return snapDateToTimeframeGrid(
        addMilliseconds(timeframe.start, deltaInMilliseconds),
      );
    },
    [
      timelineRef,
      sidebarWidth,
      timelineDirection,
      pixelsToMilliseconds,
      timeframe.start,
      snapDateToTimeframeGrid,
    ],
  );

  const getRelevanceFromDragEvent = useCallback<GetRelevanceFromDragEvent>(
    (event) => {
      const side = timelineDirection === "rtl" ? "right" : "left";
      const itemX = event.active.rect.current.translated?.[side] || 0;

      const start = getDateFromScreenX(itemX);

      if (event.active.data.current?.relevance) {
        const { start: prevItemStart, end: prevItemEnd } = event.active.data
          .current.relevance as Relevance;

        const itemDurationInMs = differenceInMilliseconds(
          prevItemEnd,
          prevItemStart,
        );

        const end = snapDateToTimeframeGrid(
          addMilliseconds(start, itemDurationInMs),
        );

        return { start, end };
      } else if (event.active.data.current?.duration) {
        const itemDurationInMs = event.active.data.current.duration as number;

        const end = snapDateToTimeframeGrid(
          addMilliseconds(start, itemDurationInMs),
        );

        return { start, end };
      }

      return null;
    },
    [getDateFromScreenX, snapDateToTimeframeGrid, timelineDirection],
  );

  const getRelevanceFromResizeEvent = useCallback<GetRelevanceFromResizeEvent>(
    (event) => {
      if (event.active.data.current?.relevance) {
        const prevRelevance = event.active.data.current.relevance as Relevance;
        const deltaInMilliseconds = pixelsToMilliseconds(event.delta.x);

        const updatedRelevance: Relevance = {
          ...prevRelevance,
        };

        updatedRelevance[event.direction] = snapDateToTimeframeGrid(
          addMilliseconds(prevRelevance[event.direction], deltaInMilliseconds),
        );

        return updatedRelevance;
      }

      return null;
    },
    [pixelsToMilliseconds, snapDateToTimeframeGrid],
  );

  const onPanEnd = useCallback<OnPanEnd>(
    (event) => {
      const deltaXInMilliseconds =
        pixelsToMilliseconds(event.deltaX) *
        (timelineDirection === "rtl" ? -1 : 1);
      const deltaYInMilliseconds =
        pixelsToMilliseconds(event.deltaY) *
        (timelineDirection === "rtl" ? -1 : 1);

      const timeframeDuration = differenceInMilliseconds(
        timeframe.start,
        timeframe.end,
      );

      const startBias = event.clientX
        ? differenceInMilliseconds(
            timeframe.start,
            getDateFromScreenX(event.clientX),
          ) / timeframeDuration
        : 1;
      const endBias = event.clientX
        ? differenceInMilliseconds(
            getDateFromScreenX(event.clientX),
            timeframe.end,
          ) / timeframeDuration
        : 1;

      const startDelta =
        deltaYInMilliseconds * startBias + deltaXInMilliseconds;
      const endDelta = -deltaYInMilliseconds * endBias + deltaXInMilliseconds;

      onTimeframeChanged((prev) => ({
        start: addMilliseconds(prev.start, startDelta),
        end: addMilliseconds(prev.end, endDelta),
      }));
    },
    [
      pixelsToMilliseconds,
      timelineDirection,
      timeframe.start,
      timeframe.end,
      getDateFromScreenX,
      onTimeframeChanged,
    ],
  );

  const onDragStart = useCallback(() => {
    dragStartTimeframe.current = timeframe;
  }, [timeframe]);

  useDndMonitor({
    onDragStart,
  });

  usePanStrategy(timelineRef, onPanEnd);

  const value = useMemo<TimelineBag>(
    () => ({
      style,
      timeframe,
      overlayed,
      onPanEnd,
      onResizeEnd,
      onResizeMove,
      onResizeStart,
      sidebarWidth,
      setSidebarWidth,
      pixelsToMilliseconds,
      millisecondsToPixels,
      timelineRef,
      setTimelineRef,
      timelineDirection,
      timeframeGridSize,
      getDateFromScreenX,
      getRelevanceFromDragEvent,
      getRelevanceFromResizeEvent,
    }),
    [
      overlayed,
      timeframe,
      onPanEnd,
      onResizeEnd,
      onResizeMove,
      onResizeStart,
      sidebarWidth,
      pixelsToMilliseconds,
      millisecondsToPixels,
      timelineRef,
      setTimelineRef,
      timelineDirection,
      timeframeGridSize,
      getDateFromScreenX,
      getRelevanceFromDragEvent,
      getRelevanceFromResizeEvent,
    ],
  );

  return value;
}
