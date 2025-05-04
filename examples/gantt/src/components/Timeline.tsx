import { useDndContext } from "@dnd-kit/core";
import type { ItemDefinition, RowDefinition } from "dnd-timeline";
import { groupItemsToSubrows, useTimelineContext } from "dnd-timeline";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Position, getSmoothStepPath } from "../utils/path";
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
	const [paths, setPaths] = useState<string[]>([]);

	const { draggableNodes } = useDndContext();

	const groupedSubrows = useMemo(
		() => groupItemsToSubrows(props.items, range),
		[props.items, range],
	);

	const connections = useMemo(() => {
		const items = Object.values(groupedSubrows)
			.flat(2)
			.sort((a, b) => (a.id > b.id ? 1 : -1));

		const connections = [
			{ from: items[0].id, to: items[1].id },
			{ from: items[2].id, to: items[3].id },
		];
		return connections;
	}, [groupedSubrows]);

	const updatePaths = useCallback(() => {
		const paths = connections.reduce((acc, { from, to }) => {
			const rect1 = draggableNodes
				.get(from)
				?.node.current?.getBoundingClientRect();
			const rect2 = draggableNodes
				.get(to)
				?.node.current?.getBoundingClientRect();

			if (!rect1 || !rect2) return acc;

			const isRef1Left = rect1.left < rect2.left;
			const leftRect = isRef1Left ? rect1 : rect2;
			const rightRect = isRef1Left ? rect2 : rect1;

			const sourceX = leftRect.right;
			const sourceY = leftRect.top + leftRect.height / 2;

			const targetX = rightRect.left;
			const targetY = rightRect.top + rightRect.height / 2;

			const [path] = getSmoothStepPath({
				sourceX,
				sourceY,
				sourcePosition: Position.Right,
				targetX,
				targetY,
				targetPosition: Position.Left,
			});

			acc.push(path);

			return acc;
		}, [] as string[]);

		setPaths(paths);
	}, [connections, draggableNodes]);

	useEffect(() => {
		let frameId: number;

		const render = () => {
			updatePaths();
			frameId = requestAnimationFrame(render);
		};

		render();

		return () => {
			cancelAnimationFrame(frameId);
		};
	}, [updatePaths]);

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
				style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none" }}
			>
				{paths.map((path) => (
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
