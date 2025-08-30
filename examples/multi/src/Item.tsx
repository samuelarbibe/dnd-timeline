import type { Span } from "dnd-timeline";
import { useItem } from "dnd-timeline";
import type React from "react";

interface ItemProps {
	id: string;
	span: Span;
	onClick: (node: React.MutableRefObject<HTMLElement>) => void;
	selected: boolean;
	children: React.ReactNode;
}

function Item(props: ItemProps) {
	const {
		setNodeRef,
		attributes,
		listeners,
		itemStyle,
		itemContentStyle,
		node,
	} = useItem({
		id: props.id,
		span: props.span,
	});

	return (
		<div
			ref={setNodeRef}
			style={itemStyle}
			{...listeners}
			{...attributes}
			onPointerUp={() => {
				props.onClick(node as React.MutableRefObject<HTMLElement>);
			}}
		>
			<div style={itemContentStyle}>
				<div
					style={{
						border: "1px solid white",
						backgroundColor: props.selected ? "grey" : "transparent",
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
