import type { CSSProperties } from "react";
import { useCallback, useMemo, useRef } from "react";

import type {
	GetDeltaXFromScreenX,
	GetSpanFromDragEvent,
	GetSpanFromResizeEvent,
	GetValueFromScreenX,
	OnPanEnd,
	OnResizeEnd,
	OnResizeMove,
	OnResizeStart,
	PixelsToValue,
	Range,
	ResizeEvents,
	TimelineBag,
	UseTimelineProps,
	ValueToPixels,
} from "../types";
import { useWheelStrategy } from "../utils/panStrategies";

import useElementRef from "./useElementRef";

const style: CSSProperties = {
	display: "flex",
	overflow: "hidden",
	position: "relative",
	flexDirection: "column",
};

const DEFAULT_RESIZE_HANDLE_WIDTH = 20;

export default function useTimeline({
	range,
	onResizeEnd,
	onResizeMove,
	onResizeStart,
	onRangeChanged,
	overlayed = false,
	rangeGridSizeDefinition,
	usePanStrategy = useWheelStrategy,
	resizeHandleWidth = DEFAULT_RESIZE_HANDLE_WIDTH,
	sidebarWidth: sidebarWidthProp,
}: UseTimelineProps): TimelineBag {
	const rangeStart = range.start;
	const rangeEnd = range.end;

	const resizeListeners = useRef<{
		resizeStart: Set<OnResizeStart>;
		resizeMove: Set<OnResizeMove>;
		resizeEnd: Set<OnResizeEnd>;
	}>({
		resizeStart: new Set(),
		resizeMove: new Set(),
		resizeEnd: new Set(),
	});

	const addResizeListener = useCallback(
		<K extends keyof ResizeEvents>(event: K, callback: ResizeEvents[K]) => {
			const listeners = resizeListeners.current[event] as Set<ResizeEvents[K]>;
			listeners.add(callback);

			return () => {
				listeners.delete(callback);
			};
		},
		[],
	);

	const handleResizeStart = useCallback<OnResizeStart>(
		(event) => {
			onResizeStart?.(event);
			resizeListeners.current.resizeStart.forEach((listener) => {
				listener(event);
			});
		},
		[onResizeStart],
	);

	const handleResizeMove = useCallback<OnResizeMove>(
		(event) => {
			onResizeMove?.(event);
			resizeListeners.current.resizeMove.forEach((listener) => {
				listener(event);
			});
		},
		[onResizeMove],
	);

	const handleResizeEnd = useCallback<OnResizeEnd>(
		(event) => {
			onResizeEnd?.(event);
			resizeListeners.current.resizeEnd.forEach((listener) => {
				listener(event);
			});
		},
		[onResizeEnd],
	);

	const {
		ref: timelineRef,
		setRef: setTimelineRef,
		width: timelineWidth,
		direction,
	} = useElementRef();

	const {
		ref: sidebarRef,
		setRef: setSidebarRef,
		width: measuredSidebarWidth,
	} = useElementRef();

	const isSidebarWidthControlled = sidebarWidthProp !== undefined;
	const sidebarWidth = sidebarWidthProp ?? measuredSidebarWidth;

	const timelineViewportWidth = timelineWidth - sidebarWidth;

	const rangeGridSize = useMemo(() => {
		if (Array.isArray(rangeGridSizeDefinition)) {
			const gridSizes = rangeGridSizeDefinition;

			const rangeSize = rangeEnd - rangeStart;

			const sortedRangeGridSizes = [...gridSizes];
			sortedRangeGridSizes.sort((a, b) => a.value - b.value);

			return sortedRangeGridSizes.find(
				(curr) => !curr.maxRangeSize || rangeSize < curr.maxRangeSize,
			)?.value;
		}

		return rangeGridSizeDefinition;
	}, [rangeStart, rangeEnd, rangeGridSizeDefinition]);

	const valueToPixelsInternal = useCallback(
		(value: number, range: Range) => {
			const start = range.start;
			const end = range.end;

			const valueToPixel = timelineViewportWidth / (end - start);
			return value * valueToPixel;
		},
		[timelineViewportWidth],
	);

	const valueToPixels = useCallback<ValueToPixels>(
		(value: number, customRange?: Range) =>
			valueToPixelsInternal(value, customRange ?? range),
		[valueToPixelsInternal, range],
	);

	const pixelsToValueInternal = useCallback(
		(pixels: number, range: Range) => {
			const start = range.start;
			const end = range.end;

			const pixelToMs = (end - start) / timelineViewportWidth;
			return pixels * pixelToMs;
		},
		[timelineViewportWidth],
	);

	const pixelsToValue = useCallback<PixelsToValue>(
		(pixels: number, customRange?: Range) =>
			pixelsToValueInternal(pixels, customRange ?? range),
		[range, pixelsToValueInternal],
	);

	const getDeltaXFromScreenX = useCallback<GetDeltaXFromScreenX>(
		(screenX) => {
			const side = direction === "rtl" ? "right" : "left";

			const timelineSideX =
				(timelineRef.current?.getBoundingClientRect()[side] || 0) +
				sidebarWidth * (direction === "rtl" ? -1 : 1);

			const deltaX = screenX - timelineSideX;

			return deltaX;
		},
		[timelineRef, sidebarWidth, direction],
	);

	const snapValueToRangeGrid = useCallback(
		(value: number) => {
			if (!rangeGridSize) return value;

			return Math.round(value / rangeGridSize) * rangeGridSize;
		},
		[rangeGridSize],
	);

	const getValueFromScreenXInternal = useCallback(
		(screenX: number, range: Range) => {
			const deltaX = getDeltaXFromScreenX(screenX);
			const delta =
				pixelsToValueInternal(deltaX, range) * (direction === "rtl" ? -1 : 1);

			return snapValueToRangeGrid(range.start + delta);
		},
		[
			direction,
			pixelsToValueInternal,
			getDeltaXFromScreenX,
			snapValueToRangeGrid,
		],
	);

	const getValueFromScreenX = useCallback<GetValueFromScreenX>(
		(screenX: number) => getValueFromScreenXInternal(screenX, range),
		[range, getValueFromScreenXInternal],
	);

	const getSpanFromDragEvent = useCallback<GetSpanFromDragEvent>(
		(event) => {
			const side = direction === "rtl" ? "right" : "left";
			const itemX = event.active.rect.current.translated?.[side] || 0;

			const start = getValueFromScreenX(itemX);

			if (event.active.data.current?.span) {
				const { start: prevItemStart, end: prevItemEnd } =
					event.active.data.current.span;

				const itemDuration = prevItemEnd - prevItemStart;

				const end = snapValueToRangeGrid(start + itemDuration);

				return { start, end };
			} else if (event.active.data.current?.duration) {
				const itemDuration = event.active.data.current.duration;

				const end = snapValueToRangeGrid(start + itemDuration);

				return { start, end };
			}

			return null;
		},
		[getValueFromScreenX, snapValueToRangeGrid, direction],
	);

	const getSpanFromResizeEvent = useCallback<GetSpanFromResizeEvent>(
		(event) => {
			if (event.active.data.current?.span) {
				const prevSpan = event.active.data.current.span;
				const delta = pixelsToValue(event.delta.x);

				const updatedRange: Range = {
					...prevSpan,
				};

				updatedRange[event.direction] = snapValueToRangeGrid(
					prevSpan[event.direction] + delta,
				);

				return updatedRange;
			}

			return null;
		},
		[pixelsToValue, snapValueToRangeGrid],
	);

	const onPanEnd = useCallback<OnPanEnd>(
		(event) => {
			onRangeChanged((prevRange) => {
				const deltaX =
					pixelsToValueInternal(event.deltaX, prevRange) *
					(direction === "rtl" ? -1 : 1);
				const deltaY =
					pixelsToValueInternal(event.deltaY, prevRange) *
					(direction === "rtl" ? -1 : 1);

				const rangeDuration = prevRange.end - prevRange.start;

				const startBias = event.clientX
					? (prevRange.start -
							getValueFromScreenXInternal(event.clientX, prevRange)) /
						rangeDuration
					: 1;
				const endBias = event.clientX
					? (getValueFromScreenXInternal(event.clientX, prevRange) -
							prevRange.end) /
						rangeDuration
					: 1;

				const startDelta = deltaY * startBias + deltaX;
				const endDelta = -deltaY * endBias + deltaX;

				return {
					start: prevRange.start + startDelta,
					end: prevRange.end + endDelta,
				};
			});
		},
		[
			direction,
			pixelsToValueInternal,
			getValueFromScreenXInternal,
			onRangeChanged,
		],
	);

	const value = useMemo<TimelineBag>(
		() => ({
			style,
			range,
			overlayed,
			onPanEnd,
			onResizeEnd: handleResizeEnd,
			onResizeMove: handleResizeMove,
			onResizeStart: handleResizeStart,
			addResizeListener,
			isSidebarWidthControlled,
			sidebarRef,
			setSidebarRef,
			sidebarWidth,
			resizeHandleWidth,
			pixelsToValue,
			valueToPixels,
			timelineRef,
			setTimelineRef,
			direction,
			rangeGridSize,
			getValueFromScreenX,
			getDeltaXFromScreenX,
			getSpanFromDragEvent,
			getSpanFromResizeEvent,
		}),
		[
			range,
			overlayed,
			onPanEnd,
			handleResizeEnd,
			handleResizeMove,
			handleResizeStart,
			addResizeListener,
			isSidebarWidthControlled,
			sidebarRef,
			setSidebarRef,
			sidebarWidth,
			resizeHandleWidth,
			pixelsToValue,
			valueToPixels,
			timelineRef,
			setTimelineRef,
			direction,
			rangeGridSize,
			getValueFromScreenX,
			getDeltaXFromScreenX,
			getSpanFromDragEvent,
			getSpanFromResizeEvent,
		],
	);

	usePanStrategy(value, onPanEnd);

	return value;
}
