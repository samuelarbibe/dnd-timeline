import { useItem } from "dnd-timeline";
import type { Span } from "dnd-timeline";
import type React from "react";
import { useState } from "react";

import ItemContent from "@/components/ui/item-content";

interface ItemProps {
	id: string;
	span: Span;
	rowId: string;
	children: React.ReactNode;
}

const COLORS = [
	"border-red-400",
	"border-amber-400",
	"border-lime-400",
	"border-emerald-400",
	"border-cyan-400",
	"border-blue-400",
	"border-violet-400",
	"border-fuchsia-400",
	"border-rose-400",
];

function hashCode(str: string) {
	let hash = 0;
	if (str.length === 0) return hash;

	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		// Convert to 32-bit integer
		hash = hash & hash;
	}

	return hash;
}

function Item(props: ItemProps) {
	const [bgColor] = useState(COLORS[hashCode(props.id) % COLORS.length]);

	const { setNodeRef, attributes, listeners, itemStyle, itemContentStyle } =
		useItem({
			id: props.id,
			span: props.span,
			data: {
				rowId: props.rowId,
			},
		});

	return (
		<div ref={setNodeRef} style={itemStyle} {...listeners} {...attributes}>
			<div style={itemContentStyle}>
				<ItemContent bgColor={bgColor}>{props.children}</ItemContent>
			</div>
		</div>
	);
}

export default Item;
