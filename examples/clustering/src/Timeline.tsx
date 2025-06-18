import type { ItemDefinition, RowDefinition } from "dnd-timeline";
import { groupItemsToSubrows, useTimelineContext } from "dnd-timeline";
import React, { useMemo } from "react";
import Item from "./Item";
import Row from "./Row";
import Sidebar from "./Sidebar";
import Subrow from "./Subrow";
import { clusterItems } from "./utils";

interface TimelineProps {
	rows: RowDefinition[];
	items: ItemDefinition[];
}

function Timeline(props: TimelineProps) {
	const { setTimelineRef, style, range } = useTimelineContext();

	const groupedSubrows = useMemo(() => {
		const clusteredItems = clusterItems(props.items, range, 0.05);
		const subrows = groupItemsToSubrows(clusteredItems, range);
		return subrows;
	}, [props.items, range]);

	return (
		<div ref={setTimelineRef} style={style}>
			{props.rows.map((row) => (
				<Row id={row.id} key={row.id} sidebar={<Sidebar row={row} />}>
					{groupedSubrows[row.id]?.map((subrow, index) => (
						<Subrow key={`${row.id}-${index}`}>
							{subrow.map((item) =>
								item.items.length > 1 ? (
									<Item id={item.id} key={item.id} span={item.span}>
										{`Clusterd items ${item.items.map(({ id }) => id).join(", ")}`}
									</Item>
								) : (
									<Item id={item.id} key={item.id} span={item.span}>
										{`Item ${item.id}`}
									</Item>
								),
							)}
						</Subrow>
					))}
				</Row>
			))}
		</div>
	);
}

export default Timeline;
