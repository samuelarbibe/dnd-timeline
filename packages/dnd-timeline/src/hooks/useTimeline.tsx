import type { CSSProperties } from "react";
import { useCallback, useMemo } from "react";

import type {
	GetSpanFromDragEvent,
	GetSpanFromResizeEvent,
	GetValueFromScreenX,
	OnPanEnd,
	PixelsToValue,
	Range,
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
}: UseTimelineProps): TimelineBag {
	const rangeStart = range.start;
	const rangeEnd = range.end;

	const {
		ref: timelineRef,
		setRef: setTimelineRef,
		width: timelineWidth,
		direction,
	} = useElementRef();

	const {
		ref: sidebarRef,
		setRef: setSidebarRef,
		width: sidebarWidth,
	} = useElementRef();

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

	const valueToPixels = useCallback<ValueToPixels>(
		(value: number, customRange?: Range) => {
			const start = customRange?.start ?? rangeStart;
			const end = customRange?.end ?? rangeEnd;

			const valueToPixel = timelineViewportWidth / (end - start);
			return value * valueToPixel;
		},
		[rangeStart, rangeEnd, timelineViewportWidth],
	);

	const pixelsToValue = useCallback<PixelsToValue>(
		(pixels: number, customRange?: Range) => {
			const start = customRange?.start ?? rangeStart;
			const end = customRange?.end ?? rangeEnd;

			const pixelToMs = (end - start) / timelineViewportWidth;
			return pixels * pixelToMs;
		},
		[rangeStart, rangeEnd, timelineViewportWidth],
	);

	const snapValueToRangeGrid = useCallback(
		(value: number) => {
			if (!rangeGridSize) return value;

			return Math.round(value / rangeGridSize) * rangeGridSize;
		},
		[rangeGridSize],
	);

	const getValueFromScreenX = useCallback<GetValueFromScreenX>(
		(screenX) => {
			const side = direction === "rtl" ? "right" : "left";

			const timelineSideX =
				(timelineRef.current?.getBoundingClientRect()[side] || 0) +
				sidebarWidth * (direction === "rtl" ? -1 : 1);

			const deltaX = screenX - timelineSideX;

			const delta = pixelsToValue(deltaX) * (direction === "rtl" ? -1 : 1);

			return snapValueToRangeGrid(rangeStart + delta);
		},
		[
			timelineRef,
			sidebarWidth,
			rangeStart,
			direction,
			pixelsToValue,
			snapValueToRangeGrid,
		],
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
			const deltaX =
				pixelsToValue(event.deltaX) * (direction === "rtl" ? -1 : 1);
			const deltaY =
				pixelsToValue(event.deltaY) * (direction === "rtl" ? -1 : 1);

			const rangeDuration = rangeEnd - rangeStart;

			const startBias = event.clientX
				? (rangeStart - getValueFromScreenX(event.clientX)) / rangeDuration
				: 1;
			const endBias = event.clientX
				? (getValueFromScreenX(event.clientX) - rangeEnd) / rangeDuration
				: 1;

			const startDelta = deltaY * startBias + deltaX;
			const endDelta = -deltaY * endBias + deltaX;

			onRangeChanged((prev) => ({
				start: prev.start + startDelta,
				end: prev.end + endDelta,
			}));
		},
		[
			rangeEnd,
			rangeStart,
			direction,
			getValueFromScreenX,
			onRangeChanged,
			pixelsToValue,
		],
	);

	usePanStrategy(timelineRef, onPanEnd);

	const value = useMemo<TimelineBag>(
		() => ({
			style,
			range,
			overlayed,
			onPanEnd,
			onResizeEnd,
			onResizeMove,
			onResizeStart,
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
			getSpanFromDragEvent,
			getSpanFromResizeEvent,
		}),
		[
			range,
			overlayed,
			onPanEnd,
			onResizeEnd,
			onResizeMove,
			onResizeStart,
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
			getSpanFromDragEvent,
			getSpanFromResizeEvent,
		],
	);

	return value;
}
