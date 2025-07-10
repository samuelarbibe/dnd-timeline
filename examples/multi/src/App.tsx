import "./index.css";
import { PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { endOfDay, startOfDay } from "date-fns";
import type {
	DragEndEvent,
	DragMoveEvent,
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
	const [range, setRange] = useState(DEFAULT_RANGE);

	const [rows] = useState(generateRows(5));
	const [items, setItems] = useState(generateItems(10, range, rows));
	const [selectedItems, setSelectedItems] = useState<
		Map<string, React.MutableRefObject<HTMLElement>>
	>(new Map());

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

	const onDragMove = useCallback(
		(event: DragMoveEvent) => {
			for (const [selectedItemId, selectedItemNode] of selectedItems) {
				if (selectedItemId === event.active.id) continue;

				const transform = CSS.Translate.toString({
					x: event.delta.x,
					y: 0,
					scaleX: 0,
					scaleY: 0,
				});

				selectedItemNode.current.style.transform = transform ?? "";
			}
		},
		[selectedItems],
	);

	const onDragEnd = useCallback(
		(event: DragEndEvent) => {
			const activeRowId = event.over?.id as string;
			const updatedSpan =
				event.active.data.current.getSpanFromDragEvent?.(event);

			if (!updatedSpan || !activeRowId) return;

			const activeItemId = event.active.id;

			setItems((prev) => {
				const activeItem = prev.find((item) => item.id === activeItemId);
				if (!activeItem) return prev;

				const spanDelta = updatedSpan.end - activeItem.span.end;

				return prev.map((item) => {
					const isActiveItem = item.id === activeItemId;
					if (isActiveItem) {
						return {
							...item,
							rowId: activeRowId,
							span: updatedSpan,
						};
					}

					const selectedItemNode = selectedItems.get(item.id);
					if (!selectedItemNode) return item;

					return {
						...item,
						span: {
							start: item.span.start + spanDelta,
							end: item.span.end + spanDelta,
						},
					};
				});
			});

			for (const [, selectedItemNode] of selectedItems) {
				if (selectedItemNode.current.style.transform) {
					selectedItemNode.current.style.transform = "";
				}
			}
			setSelectedItems(new Map());
		},
		[selectedItems],
	);

	const sensors = useSensor(PointerSensor, {
		activationConstraint: { distance: 20 },
	});

	return (
		<TimelineContext
			range={range}
			sensors={useSensors(sensors)}
			onDragMove={onDragMove}
			onDragEnd={onDragEnd}
			onResizeEnd={onResizeEnd}
			onRangeChanged={setRange}
		>
			<Timeline
				items={items}
				rows={rows}
				selectedItems={selectedItems}
				setSelectedItems={setSelectedItems}
			/>
		</TimelineContext>
	);
}

export default App;
