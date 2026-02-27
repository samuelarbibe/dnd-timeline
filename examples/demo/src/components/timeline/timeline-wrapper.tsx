import { DragOverlay } from "@dnd-kit/core";
import { endOfDay, startOfDay } from "date-fns";
import type {
	DragEndEvent,
	DragStartEvent,
	Range,
	ResizeEndEvent,
} from "dnd-timeline";
import { TimelineContext } from "dnd-timeline";
import { useAtom, useSetAtom } from "jotai";
import type { PropsWithChildren } from "react";
import { useCallback, useState } from "react";

import ItemContent from "@/components/ui/item-content";
import { activeAtom, itemsAtom } from "@/store";

const DEFAULT_RANGE: Range = {
	start: startOfDay(new Date()).getTime(),
	end: endOfDay(new Date()).getTime(),
};

function TimelineWrapper(props: PropsWithChildren) {
	const [active, setActive] = useAtom(activeAtom);
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
			setActive(null);

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
		[setItems, setActive],
	);

	const onDragStart = useCallback(
		(event: DragStartEvent) => setActive(event.active),
		[setActive],
	);

	const onDragCancel = useCallback(() => setActive(null), [setActive]);

	return (
		<TimelineContext
			onDragEnd={onDragEnd}
			onDragStart={onDragStart}
			onResizeEnd={onResizeEnd}
			onRangeChanged={setRange}
			onDragCancel={onDragCancel}
			autoScroll={{ enabled: false }}
			range={range}
			sidebarWidth={224}
			overlayed
		>
			{props.children}
			<DragOverlay>
				{active && (
					<ItemContent classes="border-red-400">{active.id}</ItemContent>
				)}
			</DragOverlay>
		</TimelineContext>
	);
}

export default TimelineWrapper;
