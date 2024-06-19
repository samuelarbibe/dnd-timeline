import { endOfDay, startOfDay } from "date-fns";
import type { DragEndEvent, Range, ResizeEndEvent } from "dnd-timeline";
import { TimelineContext } from "dnd-timeline";
import { useSetAtom } from "jotai";
import type { PropsWithChildren } from "react";
import React, { useCallback, useState } from "react";
import { itemsAtom } from "../../store";

const DEFAULT_RANGE: Range = {
	start: startOfDay(new Date()).getTime(),
	end: endOfDay(new Date()).getTime(),
};

function TimelineWrapper(props: PropsWithChildren) {
	const [range, setRange] = useState(DEFAULT_RANGE);

	const setItems = useSetAtom(itemsAtom);

	const onResizeEnd = useCallback(
		(event: ResizeEndEvent) => {
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
		},
		[setItems],
	);

	const onDragEnd = useCallback(
		(event: DragEndEvent) => {
			const activeRowId = event.over?.id as string;
			const updatedSpan =
				event.active.data.current.getSpanFromDragEvent?.(event);

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
		},
		[setItems],
	);

	return (
		<TimelineContext
			onDragEnd={onDragEnd}
			onResizeEnd={onResizeEnd}
			onRangeChanged={setRange}
			range={range}
		>
			{props.children}
		</TimelineContext>
	);
}

export default TimelineWrapper;
