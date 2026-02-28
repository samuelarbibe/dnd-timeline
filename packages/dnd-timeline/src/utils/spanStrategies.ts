import type {
	DragSpanEvent,
	Range,
	ResizeSpanEvent,
	TimelineBag,
} from "../types";

const snapValueToRangeGrid = (value: number, rangeGridSize?: number) => {
	if (!rangeGridSize) return value;

	return Math.round(value / rangeGridSize) * rangeGridSize;
};

export type GetDefaultSpanFromDragEvent = (
	event: DragSpanEvent,
	timelineBag: TimelineBag,
) => Range | null;

export type GetDefaultSpanFromResizeEvent = (
	event: ResizeSpanEvent,
	timelineBag: TimelineBag,
) => Range | null;

export const getDefaultSpanFromDragEvent: GetDefaultSpanFromDragEvent = (
	event,
	timelineBag,
) => {
	const side = timelineBag.direction === "rtl" ? "right" : "left";
	const itemX = event.active.rect.current.translated?.[side] || 0;

	const start = timelineBag.getValueFromScreenX(itemX);

	if (event.active.data.current?.span) {
		const { start: previousStart, end: previousEnd } =
			event.active.data.current.span;
		const duration = previousEnd - previousStart;
		const end = snapValueToRangeGrid(
			start + duration,
			timelineBag.rangeGridSize,
		);

		return { start, end };
	}

	if (event.active.data.current?.duration) {
		const duration = event.active.data.current.duration;
		const end = snapValueToRangeGrid(
			start + duration,
			timelineBag.rangeGridSize,
		);

		return { start, end };
	}

	return null;
};

export const getDefaultSpanFromResizeEvent: GetDefaultSpanFromResizeEvent = (
	event,
	timelineBag,
) => {
	if (!event.active.data.current?.span) return null;

	const previousSpan = event.active.data.current.span;
	const delta = timelineBag.pixelsToValue(event.delta.x);
	const updatedRange: Range = {
		...previousSpan,
	};

	updatedRange[event.direction] = snapValueToRangeGrid(
		previousSpan[event.direction] + delta,
		timelineBag.rangeGridSize,
	);

	return updatedRange;
};
