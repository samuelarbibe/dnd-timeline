import "./index.css";
import { endOfDay, startOfDay } from "date-fns";
import type {
	DragEndEvent,
	Range,
	ResizeEndEvent,
	RowDefinition,
} from "dnd-timeline";
import { TimelineContext } from "dnd-timeline";
import { useCallback, useState } from "react";
import Timeline from "./Timeline";
import { generateItems, generateRows } from "./utils";

export type GroupedRowDefinition = RowDefinition & { group: string };

const DEFAULT_RANGE: Range = {
	start: startOfDay(new Date()).getTime(),
	end: endOfDay(new Date()).getTime(),
};

function App() {
	const [range, setRange] = useState(DEFAULT_RANGE);

	const [rows] = useState(generateRows(20, ["A", "B", "C", "D"]));
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

	return (
		<TimelineContext
			range={range}
			onDragEnd={onDragEnd}
			onResizeEnd={onResizeEnd}
			onRangeChanged={setRange}
		>
			<Timeline items={items} rows={rows} />
		</TimelineContext>
	);
}

export default App;
