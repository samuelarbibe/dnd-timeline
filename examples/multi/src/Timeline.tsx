import type { ItemDefinition, RowDefinition } from "dnd-timeline";
import { groupItemsToSubrows, useTimelineContext } from "dnd-timeline";
import type React from "react";
import { useMemo } from "react";
import Item from "./Item";
import Row from "./Row";
import Sidebar from "./Sidebar";
import Subrow from "./Subrow";

interface TimelineProps {
	selectedItems: Map<string, React.MutableRefObject<HTMLElement>>;
	setSelectedItems: React.Dispatch<
		React.SetStateAction<Map<string, React.MutableRefObject<HTMLElement>>>
	>;
	rows: RowDefinition[];
	items: ItemDefinition[];
}

function Timeline(props: TimelineProps) {
	const { setTimelineRef, style, range } = useTimelineContext();

	const groupedSubrows = useMemo(
		() => groupItemsToSubrows(props.items, range),
		[props.items, range],
	);

	return (
		<div ref={setTimelineRef} style={style}>
			{props.rows.map((row) => (
				<Row id={row.id} key={row.id} sidebar={<Sidebar row={row} />}>
					{groupedSubrows[row.id]?.map((subrow, index) => (
						<Subrow key={`${row.id}-${index}`}>
							{subrow.map((item) => (
								<Item
									id={item.id}
									key={item.id}
									span={item.span}
									selected={props.selectedItems.has(item.id)}
									onClick={(node) => {
										props.setSelectedItems((prev) => {
											prev.has(item.id)
												? prev.delete(item.id)
												: prev.set(item.id, node);
											return new Map(prev);
										});
									}}
								>
									{`Item ${item.id}`}
								</Item>
							))}
						</Subrow>
					))}
				</Row>
			))}
		</div>
	);
}

export default Timeline;
