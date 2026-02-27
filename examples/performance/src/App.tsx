import "./index.css";
import { endOfDay, startOfDay } from "date-fns";
import type { DragEndEvent, Range, ResizeEndEvent } from "dnd-timeline";
import { TimelineContext } from "dnd-timeline";
import { useCallback, useDeferredValue, useState } from "react";
import { useDebounce, useThrottle } from "./hooks";
import Timeline from "./Timeline";
import { generateItems, generateRows } from "./utils";

const DEFAULT_RANGE: Range = {
	start: startOfDay(new Date()).getTime(),
	end: endOfDay(new Date()).getTime(),
};

enum RangeType {
	NORMAL = "Normal",
	DEBOUNCED = "Debounced",
	THROTTLED = "Throttled",
	DEFERRED = "Deferred",
}

function App() {
	const [rangeType, setRangeType] = useState<RangeType>(RangeType.NORMAL);

	const [range, setRange] = useState(DEFAULT_RANGE);
	const debouncedRange = useDebounce(range, 300);
	const throttledRange = useThrottle(range, 300);
	const deferredRange = useDeferredValue(range);

	const rangeByType = {
		[RangeType.NORMAL]: range,
		[RangeType.DEBOUNCED]: debouncedRange,
		[RangeType.THROTTLED]: throttledRange,
		[RangeType.DEFERRED]: deferredRange,
	};

	const selectedRange = rangeByType[rangeType];

	const [rows] = useState(generateRows(1));
	const [items, setItems] = useState(generateItems(500, selectedRange, rows));

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

	return (
		<>
			{Object.values(RangeType).map((rangeTypeOption) => (
				<>
					<input
						key={rangeTypeOption}
						checked={rangeType === rangeTypeOption}
						id={rangeTypeOption}
						onClick={() => {
							setRangeType(rangeTypeOption);
						}}
						type="radio"
						value={rangeType}
					/>
					<label key={rangeTypeOption} htmlFor={rangeTypeOption}>
						{rangeTypeOption}
					</label>
				</>
			))}
			<TimelineContext
				range={selectedRange}
				onDragEnd={onDragEnd}
				onResizeEnd={onResizeEnd}
				onRangeChanged={setRange}
				sidebarWidth={200}
			>
				<Timeline items={items} rows={rows} range={range} />
			</TimelineContext>
		</>
	);
}

export default App;
