import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { ItemDefinition, RowDefinition } from "dnd-timeline";
import { groupItemsToSubrows, useTimelineContext } from "dnd-timeline";
import { useMemo } from "react";
import Item from "./Item";
import Row from "./Row";
import Sidebar from "./Sidebar";
import Subrow from "./Subrow";

interface TimelineProps {
	rows: RowDefinition[];
	items: ItemDefinition[];
}

function Timeline(props: TimelineProps) {
	const { setTimelineRef, style, range } = useTimelineContext();

	const groupedSubrows = useMemo(
		() => groupItemsToSubrows(props.items, range),
		[props.items, range],
	);

	const rowIds = useMemo(() => props.rows.map(({ id }) => id), [props.rows]);

	return (
		<SortableContext items={rowIds} strategy={verticalListSortingStrategy}>
			<div ref={setTimelineRef} style={style}>
				{props.rows.map((row) => (
					<Row id={row.id} key={row.id} sidebar={<Sidebar row={row} />}>
						{groupedSubrows[row.id]?.map((subrow, index) => (
							<Subrow key={`${row.id}-${index}`}>
								{subrow.map((item) => (
									<Item id={item.id} key={item.id} span={item.span}>
										{`Item ${item.id}`}
									</Item>
								))}
							</Subrow>
						))}
					</Row>
				))}
			</div>
		</SortableContext>
	);
}

export default Timeline;
