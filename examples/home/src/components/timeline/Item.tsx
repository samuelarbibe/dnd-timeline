import { Box, Flex } from "@radix-ui/themes";
import type { Span } from "dnd-timeline";
import { useItem } from "dnd-timeline";
import type React from "react";

interface ItemProps {
	id: string;
	span: Span;
	children: React.ReactNode;
}

function Item(props: ItemProps) {
	const { setNodeRef, attributes, listeners, itemStyle, itemContentStyle } =
		useItem({
			id: props.id,
			span: props.span,
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
