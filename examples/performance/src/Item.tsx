import { useItem } from "dnd-timeline";
import type { Relevance } from "dnd-timeline";
import type { CSSProperties } from "react";
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

	const style: CSSProperties = {
		...itemStyle,
		transition: "left .2s linear, width .2s linear",
	};

	return (
		<div ref={setNodeRef} style={style} {...listeners} {...attributes}>
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
