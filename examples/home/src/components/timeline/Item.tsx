import { Box, Flex } from "@radix-ui/themes";
import { useItem } from "dnd-timeline";
import type { Relevance } from "dnd-timeline";
import type React from "react";

interface ItemProps {
	id: string;
	relevance: Relevance;
	children: React.ReactNode;
}

function Item(props: ItemProps) {
	const { setNodeRef, attributes, listeners, itemStyle, itemContentStyle } =
		useItem({
			id: props.id,
			relevance: props.relevance,
		});

	return (
		<Box ref={setNodeRef} style={itemStyle} {...listeners} {...attributes}>
			<div style={itemContentStyle}>
				<Flex
					align="center"
					px="1"
					style={{
						userSelect: "none",
						border: "2px solid var(--accent-9)",
						borderRadius: "var(--radius-2)",
					}}
					width="100%"
				>
					{props.children}
				</Flex>
			</div>
		</Box>
	);
}

export default Item;
