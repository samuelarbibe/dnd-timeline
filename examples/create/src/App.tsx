import "./index.css";
import { endOfDay, startOfDay } from "date-fns";
import type {
	DragDirection,
	DragEndEvent,
	GetSpanFromDragEventStrategy,
	GetSpanFromResizeEventStrategy,
	Range,
	ResizeEndEvent,
	Span,
} from "dnd-timeline";
import { TimelineContext } from "dnd-timeline";
import { nanoid } from "nanoid";
import { useCallback, useState } from "react";
import Timeline from "./Timeline";
import { generateItems, generateRows } from "./utils";

const DEFAULT_RANGE: Range = {
	start: startOfDay(new Date()).getTime(),
	end: endOfDay(new Date()).getTime(),
};
const GRID_SIZE = 30 * 60 * 1000;
const MIN_ITEM_DURATION = 60 * 60 * 1000;

function App() {
	const [range, setRange] = useState(DEFAULT_RANGE);

	const [rows] = useState(generateRows(5));
	const [items, setItems] = useState(generateItems(10, range, rows));

	const onResizeEnd = useCallback((event: ResizeEndEvent) => {
		const updatedSpan =
			event.active.data.current.getSpanFromResizeEvent?.(event);

		if (!updatedSpan) return;

		const activeItemId = event.active.id;

		setItems((prev) =>
			prev.map((item) => {
				if (item.id !== activeItemId) return item;

				return {
					...item,
					span: updatedSpan,
				};
			}),
		);
	}, []);

	const onDragEnd = useCallback((event: DragEndEvent) => {
		const activeRowId = event.over?.id as string;
		const updatedSpan = event.active.data.current.getSpanFromDragEvent?.(event);

		if (!updatedSpan || !activeRowId) return;

		const activeItemId = event.active.id;

		setItems((prev) =>
			prev.map((item) => {
				if (item.id !== activeItemId) return item;

				return {
					...item,
					rowId: activeRowId,
					span: updatedSpan,
				};
			}),
		);
	}, []);

	const onCreateItem = useCallback((span: Span, rowId: string) => {
		setItems((prev) => [...prev, { id: `item-${nanoid(4)}`, rowId, span }]);
	}, []);

	const clampSpanToRange = useCallback(
		(span: Span): Span | null => {
			const duration = span.end - span.start;
			if (duration <= 0) return null;

			const rangeDuration = range.end - range.start;
			if (duration > rangeDuration) return null;

			if (span.start < range.start) {
				return {
					start: range.start,
					end: range.start + duration,
				};
			}

			if (span.end > range.end) {
				return {
					start: range.end - duration,
					end: range.end,
				};
			}

			return span;
		},
		[range.end, range.start],
	);

	const normalizeResizableSpan = useCallback(
		(span: Span, direction: DragDirection): Span | null => {
			const duration = span.end - span.start;
			if (duration <= 0) return null;

			const spanWithMinDuration =
				duration >= MIN_ITEM_DURATION
					? span
					: direction === "start"
						? {
								start: span.end - MIN_ITEM_DURATION,
								end: span.end,
							}
						: {
								start: span.start,
								end: span.start + MIN_ITEM_DURATION,
							};

			return clampSpanToRange(spanWithMinDuration);
		},
		[clampSpanToRange],
	);

	const getSpanFromDragEventStrategy =
		useCallback<GetSpanFromDragEventStrategy>(
			// Keep dragged items inside the visible timeline range.
			(event, defaultGetSpanFromDragEvent) => {
				const span = defaultGetSpanFromDragEvent(event);
				if (!span) return null;

				return clampSpanToRange(span);
			},
			[clampSpanToRange],
		);

	const getSpanFromResizeEventStrategy =
		useCallback<GetSpanFromResizeEventStrategy>(
			// Enforce a minimum item duration and keep resize results in range.
			// The same normalization is reused by CreateItem preview/finalization.
			(event, defaultGetSpanFromResizeEvent) => {
				const span = defaultGetSpanFromResizeEvent(event);
				if (!span) return null;

				return normalizeResizableSpan(span, event.direction);
			},
			[normalizeResizableSpan],
		);

	return (
		<TimelineContext
			range={range}
			onDragEnd={onDragEnd}
			onResizeEnd={onResizeEnd}
			onRangeChanged={setRange}
			rangeGridSizeDefinition={GRID_SIZE}
			getSpanFromDragEventStrategy={getSpanFromDragEventStrategy}
			getSpanFromResizeEventStrategy={getSpanFromResizeEventStrategy}
		>
			<Timeline
				items={items}
				rows={rows}
				onCreateItem={onCreateItem}
				normalizeCreateSpan={normalizeResizableSpan}
			/>
		</TimelineContext>
	);
}

export default App;
