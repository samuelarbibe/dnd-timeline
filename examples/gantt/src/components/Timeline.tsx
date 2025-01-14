import { useDndContext } from "@dnd-kit/core";
import type { ItemDefinition, RowDefinition } from "dnd-timeline";
import { groupItemsToSubrows, useTimelineContext } from "dnd-timeline";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
	Position,
	type SmoothStepPath,
	type XYPosition,
	getSmoothStepPath,
} from "../utils/path";
import Item from "./Item";
import Row from "./Row";
import Sidebar from "./Sidebar";
import Subrow from "./Subrow";

interface TimelineProps {
	rows: RowDefinition[];
	items: ItemDefinition[];
}

const getConnectionPoint = (rect: DOMRect, position: Position): XYPosition => {
	const { x, y, height, width } = rect;

	return {
		x: x + (position === Position.Right ? width : 0),
		y: y + height / 2,
	};
};

function Timeline(props: TimelineProps) {
	const { setTimelineRef, style, range, timelineRef } = useTimelineContext();
	const [pathsData, setPathsData] = useState<SmoothStepPath[]>([]);

	const groupedSubrows = useMemo(
		() => groupItemsToSubrows(props.items, range),
		[props.items, range],
	);

	const { draggableNodes } = useDndContext();

	console.log(timelineRef);

	const isLoaded = !!timelineRef.current;

	useEffect(() => {
		if (!isLoaded) return;

		const items = Object.values(groupedSubrows)
			.flat(2)
			.sort((a, b) => (a.id > b.id ? 1 : -1));

		const connections = [
			{ from: items[0].id, to: items[1].id },
			{ from: items[2].id, to: items[3].id },
		];

		const paths = connections.reduce((acc, { from, to }) => {
			const source = draggableNodes
				.get(from)
				?.node.current?.getClientRects()[0];
			const target = draggableNodes.get(to)?.node.current?.getClientRects()[0];

			if (!source || !target) return acc;

			const { x: sourceX, y: sourceY } = getConnectionPoint(
				source,
				Position.Right,
			);
			const { x: targetX, y: targetY } = getConnectionPoint(
				target,
				Position.Left,
			);

			acc.push(
				getSmoothStepPath({
					sourceX,
					sourceY,
					sourcePosition: Position.Right,
					targetX,
					targetY,
					targetPosition: Position.Left,
				}),
			);

			return acc;
		}, [] as SmoothStepPath[]);

		setPathsData(paths);
	}, [groupedSubrows, draggableNodes, isLoaded]);

	return (
		<div ref={setTimelineRef} style={style}>
			{props.rows.map((row) => (
				<Row id={row.id} key={row.id} sidebar={<Sidebar row={row} />}>
					{groupedSubrows[row.id]?.map((subrow, index) => (
						<Subrow key={`${row.id}-${index}`}>
							{subrow.map((item) => (
								<Item key={item.id} id={item.id} span={item.span}>
									{`Item ${item.id}`}
								</Item>
							))}
						</Subrow>
					))}
				</Row>
			))}
			<svg
				width="100%"
				height="100%"
				style={{ position: "absolute", pointerEvents: "none" }}
			>
				{pathsData.map(([path]) => (
					<path
						key={path}
						d={path}
						stroke="red"
						fill="transparent"
						strokeWidth={3}
					/>
				))}
			</svg>
		</div>
	);
}

export default Timeline;
