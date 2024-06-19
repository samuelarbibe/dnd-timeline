import { ReloadIcon } from "@radix-ui/react-icons";
import { Button, Card, Flex, Inset, Kbd, Text } from "@radix-ui/themes";
import { groupItemsToSubrows, useTimelineContext } from "dnd-timeline";
import { useAtom, useAtomValue } from "jotai";
import React, { useMemo } from "react";
import { itemsAtom, rowsAtom } from "../../store";
import { generateItems } from "../../utils";
import Item from "./Item";
import Row from "./Row";
import Sidebar from "./Sidebar";
import Subrow from "./Subrow";

function Timeline() {
	const rows = useAtomValue(rowsAtom);
	const [items, setItems] = useAtom(itemsAtom);
	const { setTimelineRef, style, range } = useTimelineContext();

	const regenerateItems = () => {
		setItems(generateItems(10, range, rows));
	};

	const groupedSubrows = useMemo(
		() => groupItemsToSubrows(items, range),
		[items, range],
	);

	return (
		<Flex direction="column" gap="3">
			<Flex direction="row" justify="end">
				<Button
					onClick={() => {
						regenerateItems();
					}}
					variant="ghost"
				>
					<ReloadIcon /> Regenrate
				</Button>
			</Flex>
			<Card variant="surface">
				<Inset className="select-none" ref={setTimelineRef} style={style}>
					{rows.map((row) => (
						<Row id={row.id} key={row.id} sidebar={<Sidebar row={row} />}>
							{groupedSubrows[row.id]?.map((subrow, index) => (
								<Subrow key={`${row.id}-${index}`}>
									{subrow.map((item) => (
										<Item id={item.id} key={item.id} span={item.span}>
											<Text>{item.id}</Text>
										</Item>
									))}
								</Subrow>
							))}
						</Row>
					))}
				</Inset>
			</Card>
			<Flex direction="row" gap="4" justify="start">
				<Flex align="end" direction="row" gap="2">
					<Text color="gray">Zoom In / Out:</Text>
					<Kbd>⌘</Kbd>+<Kbd>Wheel</Kbd>
				</Flex>
				<Flex align="end" direction="row" gap="2">
					<Text color="gray">Move Right / Left:</Text>
					<Kbd>⌘</Kbd>+<Kbd>⇧</Kbd>+<Kbd>Wheel</Kbd>
				</Flex>
			</Flex>
		</Flex>
	);
}

export default Timeline;
