import { useVirtualizer } from "@tanstack/react-virtual";
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
	const { setTimelineRef, timelineRef, style, range } = useTimelineContext();

	const groupedSubrows = useMemo(
		() => groupItemsToSubrows(props.items, range),
		[props.items, range],
	);

	const rowVirtualizer = useVirtualizer({
		count: props.rows.length,
		getItemKey: (index) => props.rows[index].id,
		getScrollElement: () => timelineRef.current,
		estimateSize: (index) =>
			(groupedSubrows[props.rows[index].id]?.length || 1) * 50,
	});

	return (
		<div
			ref={setTimelineRef}
			style={{
				...style,
				height: 400,
				overflowY: "auto",
				overflowX: "hidden",
				border: "1px solid white",
			}}
		>
			<div
				style={{
					minHeight: `${rowVirtualizer.getTotalSize()}px`,
					width: "100%",
					overflow: "hidden",
					position: "relative",
				}}
			>
				{rowVirtualizer.getVirtualItems().map((virtualRow) => (
					<div
						key={virtualRow.key}
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							transform: `translateY(${virtualRow.start}px)`,
						}}
					>
						<Row
							id={virtualRow.key as string}
							key={virtualRow.key}
							sidebar={<Sidebar row={props.rows[virtualRow.index]} />}
						>
							{groupedSubrows[virtualRow.key]?.map((subrow, index) => (
								<Subrow key={`${virtualRow.key}-${index}`}>
									{subrow.map((item) => (
										<Item id={item.id} key={item.id} span={item.span}>
											{`Item ${item.id}`}
										</Item>
									))}
								</Subrow>
							))}
						</Row>
					</div>
				))}
			</div>
		</div>
	);
}

export default Timeline;
