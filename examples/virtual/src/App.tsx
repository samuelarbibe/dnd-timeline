import "./index.css";
import { type Active, DragOverlay, MeasuringStrategy } from "@dnd-kit/core";
import { endOfDay, startOfDay } from "date-fns";
import type {
	DragEndEvent,
	DragStartEvent,
	Range,
	ResizeEndEvent,
} from "dnd-timeline";
import { TimelineContext } from "dnd-timeline";
import { useCallback, useState } from "react";
import Timeline from "./Timeline";
import { generateItems, generateRows } from "./utils";

const DEFAULT_RANGE: Range = {
	start: startOfDay(new Date()).getTime(),
	end: endOfDay(new Date()).getTime(),
};

function App() {
	const [active, setActive] = useState<Active | null>(null);
	const [range, setRange] = useState(DEFAULT_RANGE);

	const [rows] = useState(generateRows(1000));
	const [items, setItems] = useState(generateItems(1000, range, rows));

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
		setActive(null);
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

	const onDragStart = useCallback(
		(event: DragStartEvent) => setActive(event.active),
		[],
	);

	const onDragCancel = useCallback(() => setActive(null), []);

	return (
		<TimelineContext
			range={range}
			onDragEnd={onDragEnd}
			onDragStart={onDragStart}
			onResizeEnd={onResizeEnd}
			onDragCancel={onDragCancel}
			onRangeChanged={setRange}
			autoScroll={{ enabled: false }}
			overlayed
		>
			<Timeline items={items} rows={rows} activeItem={active} />
			<DragOverlay>{active && <div>{active.id}</div>}</DragOverlay>
		</TimelineContext>
	);
}

export default App;
