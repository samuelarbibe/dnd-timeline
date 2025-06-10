import type { ItemDefinition, RowDefinition } from "dnd-timeline";
import { groupItemsToSubrows, useTimelineContext } from "dnd-timeline";
import React, { useMemo } from "react";
import type { GroupedRowDefinition } from "./App";
import Group from "./Group";
import Item from "./Item";
import Row from "./Row";
import Sidebar from "./Sidebar";
import Subrow from "./Subrow";

interface TimelineProps {
	rows: GroupedRowDefinition[];
	items: ItemDefinition[];
}

function Timeline(props: TimelineProps) {
	const { setTimelineRef, style, range } = useTimelineContext();

	const groupedSubrows = useMemo(
		() => groupItemsToSubrows(props.items, range),
		[props.items, range],
	);

	const groupedRows = useMemo(
		() =>
			props.rows.reduce(
				(acc, curr) => {
					if (!acc[curr.group]) acc[curr.group] = [];
					acc[curr.group].push(curr);
					return acc;
				},
				{} as Record<string, GroupedRowDefinition[]>,
			),
		[props.rows],
	);

	return (
		<div ref={setTimelineRef} style={style}>
			{Object.entries(groupedRows).map(([groupKey, rows]) => (
				<Group key={groupKey} groupKey={groupKey}>
					{rows.map((row) => (
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
				</Group>
			))}
		</div>
	);
}

export default Timeline;
