import { format, hoursToMilliseconds, minutesToMilliseconds } from "date-fns";
import type { ItemDefinition, RowDefinition } from "dnd-timeline";
import { groupItemsToSubrows, useTimelineContext } from "dnd-timeline";
import { useMemo } from "react";
import Item from "./Item";
import Row from "./Row";
import Sidebar from "./Sidebar";
import Subrow from "./Subrow";
import type { MarkerDefinition } from "./TimeAxis";
import TimeAxis from "./TimeAxis";
import TimeCursor from "./TimeCursor";

const timeAxisMarkers: MarkerDefinition[] = [
	{
		value: hoursToMilliseconds(24),
		getLabel: (date: Date) => format(date, "E"),
	},
	{
		value: hoursToMilliseconds(2),
		minRangeSize: hoursToMilliseconds(24),
		getLabel: (date: Date) => format(date, "k"),
	},
	{
		value: hoursToMilliseconds(1),
		minRangeSize: hoursToMilliseconds(24),
	},
	{
		value: hoursToMilliseconds(1),
		maxRangeSize: hoursToMilliseconds(24),
		getLabel: (date: Date) => format(date, "k"),
	},
	{
		value: minutesToMilliseconds(30),
		maxRangeSize: hoursToMilliseconds(24),
		minRangeSize: hoursToMilliseconds(12),
	},
	{
		value: minutesToMilliseconds(15),
		maxRangeSize: hoursToMilliseconds(12),
		getLabel: (date: Date) => format(date, "m"),
	},
	{
		value: minutesToMilliseconds(5),
		maxRangeSize: hoursToMilliseconds(6),
		minRangeSize: hoursToMilliseconds(3),
	},
	{
		value: minutesToMilliseconds(5),
		maxRangeSize: hoursToMilliseconds(3),
		getLabel: (date: Date) => format(date, "m"),
	},
	{
		value: minutesToMilliseconds(1),
		maxRangeSize: hoursToMilliseconds(2),
	},
];

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

	return (
		<div ref={setTimelineRef} style={style}>
			<TimeAxis markers={timeAxisMarkers} />
			<TimeCursor />
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
	);
}

export default Timeline;
