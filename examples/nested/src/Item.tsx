import { useItem } from "dnd-timeline";
import type { Span } from "dnd-timeline";
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
		<div ref={setNodeRef} style={itemStyle} {...listeners} {...attributes}>
			<div style={itemContentStyle}>
				<div
					style={{
						border: "1px solid white",
						width: "100%",
						overflow: "hidden",
					}}
				>
					{props.children}
				</div>
			</div>
		</div>
	);
}

export default Item;
