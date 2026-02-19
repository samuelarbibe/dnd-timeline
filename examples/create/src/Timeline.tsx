import type {
	DragDirection,
	ItemDefinition,
	RowDefinition,
	Span,
} from "dnd-timeline";
import { groupItemsToSubrows, useTimelineContext } from "dnd-timeline";
import { useMemo } from "react";
import Item from "./Item";
import Row from "./Row";
import Sidebar from "./Sidebar";
import Subrow from "./Subrow";

interface TimelineProps {
	rows: RowDefinition[];
	items: ItemDefinition[];
	onCreateItem: (span: Span, rowId: string) => void;
	normalizeCreateSpan: (span: Span, direction: DragDirection) => Span | null;
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
				<Row
					id={row.id}
					key={row.id}
					sidebar={<Sidebar row={row} />}
					onCreateItem={props.onCreateItem}
					normalizeCreateSpan={props.normalizeCreateSpan}
				>
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
