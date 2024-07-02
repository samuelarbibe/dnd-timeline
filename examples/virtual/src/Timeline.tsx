import { type Active, useDndContext } from "@dnd-kit/core";
import {
	type Range,
	defaultRangeExtractor,
	useVirtualizer,
} from "@tanstack/react-virtual";
import type { ItemDefinition, RowDefinition } from "dnd-timeline";
import { groupItemsToSubrows, useTimelineContext } from "dnd-timeline";
import { useCallback, useMemo } from "react";
import Item from "./Item";
import Row from "./Row";
import Sidebar from "./Sidebar";
import Subrow from "./Subrow";
import { useAutoscroll } from "./useAutoscroll";

interface TimelineProps {
	activeItem: Active | null;
	rows: RowDefinition[];
	items: ItemDefinition[];
}

function Timeline(props: TimelineProps) {
	const { dragOverlay } = useDndContext();
	const { setTimelineRef, timelineRef, style, range } = useTimelineContext();

	useAutoscroll({
		containerRef: timelineRef,
		dragOverlay: dragOverlay,
	});

	const groupedSubrows = useMemo(
		() => groupItemsToSubrows(props.items, range),
		[props.items, range],
	);

	const activeItemIndex = useMemo(
		() =>
			props.rows.findIndex(
				(row) => row.id === props.activeItem?.data.current?.rowId,
			),
		[props.rows, props.activeItem],
	);

	const rowVirtualizer = useVirtualizer({
		count: props.rows.length,
		getItemKey: (index) => props.rows[index].id,
		getScrollElement: () => timelineRef.current,
		estimateSize: (index) =>
			(groupedSubrows[props.rows[index].id]?.length || 1) * 50,
		rangeExtractor: useCallback(
			(range: Range) => {
				const next = new Set([
					...(activeItemIndex === -1 ? [] : [activeItemIndex]),
					...defaultRangeExtractor(range),
				]);

				return [...next].sort((a, b) => a - b);
			},
			[activeItemIndex],
		),
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
										<Item
											id={item.id}
											rowId={item.rowId}
											key={item.id}
											span={item.span}
										>
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
