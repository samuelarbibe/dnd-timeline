import "./index.css";
import { endOfDay, startOfDay } from "date-fns";
import type {
	DragDirection,
	DragEndEvent,
	GetSpanFromResizeEventStrategy,
	ItemDefinition,
	Range,
	ResizeEndEvent,
	RowDefinition,
	Span,
} from "dnd-timeline";
import { getDefaultSpanFromResizeEvent, TimelineContext } from "dnd-timeline";
import { useCallback, useState } from "react";
import Timeline from "./Timeline";

const DEFAULT_RANGE: Range = {
	start: startOfDay(new Date()).getTime(),
	end: endOfDay(new Date()).getTime(),
};
const GRID_SIZE = 30 * 60 * 1000;
const MIN_ITEM_DURATION = 60 * 60 * 1000;
const SIDEBAR_WIDTH = 200;

const ROWS: RowDefinition[] = [{ id: "1" }, { id: "2" }];

const createInitialItems = (range: Range): ItemDefinition[] => [
	{
		id: "item-1",
		rowId: ROWS[0].id,
		span: {
			start: range.start + 2 * MIN_ITEM_DURATION,
			end: range.start + 4 * MIN_ITEM_DURATION,
		},
	},
	{
		id: "item-2",
		rowId: ROWS[0].id,
		span: {
			start: range.start + 5 * MIN_ITEM_DURATION,
			end: range.start + 7 * MIN_ITEM_DURATION,
		},
	},
	{
		id: "item-3",
		rowId: ROWS[1].id,
		span: {
			start: range.start + 9 * MIN_ITEM_DURATION,
			end: range.start + 11 * MIN_ITEM_DURATION,
		},
	},
];

function App() {
	const [range, setRange] = useState(DEFAULT_RANGE);
	const [items, setItems] = useState(() => createInitialItems(DEFAULT_RANGE));

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
			const spanWithMinDuration =
				duration >= MIN_ITEM_DURATION
					? span
					: direction === "start"
						? {
								start: span.start,
								end: span.start + MIN_ITEM_DURATION,
							}
						: {
								start: span.end - MIN_ITEM_DURATION,
								end: span.end,
							};

			return clampSpanToRange(spanWithMinDuration);
		},
		[clampSpanToRange],
	);

	const getSpanFromResizeEventStrategy =
		useCallback<GetSpanFromResizeEventStrategy>(
			(event, timelineBag) => {
				const span = getDefaultSpanFromResizeEvent(event, timelineBag);
				if (!span) return null;

				return normalizeResizableSpan(span, event.direction);
			},
			[normalizeResizableSpan],
		);

	return (
		<div style={{ padding: 16 }}>
			<p style={{ margin: "0 0 16px" }}>
				Resize snaps to defined grid and continues moving the opposite edge when
				you drag past it from either side.
			</p>
			<TimelineContext
				range={range}
				onDragEnd={onDragEnd}
				onResizeEnd={onResizeEnd}
				onRangeChanged={setRange}
				rangeGridSizeDefinition={GRID_SIZE}
				sidebarWidth={SIDEBAR_WIDTH}
				useResizeAnimation
				getSpanFromResizeEventStrategy={getSpanFromResizeEventStrategy}
			>
				<Timeline items={items} rows={ROWS} />
			</TimelineContext>
		</div>
	);
}

export default App;
