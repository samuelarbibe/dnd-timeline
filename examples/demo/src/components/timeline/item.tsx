import { useItem } from "dnd-timeline";
import type { Relevance } from "dnd-timeline";
import type React from "react";
import { useState } from "react";

interface ItemProps {
	id: string;
	relevance: Relevance;
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
			relevance: props.relevance,
		});

	return (
		<div ref={setNodeRef} style={itemStyle} {...listeners} {...attributes}>
			<div style={itemContentStyle}>
				<div
					className={`border-2 rounded-sm shadow-md w-full overflow-hidden flex flex-row pl-3 items-center ${bgColor}`}
				>
					{props.children}
				</div>
			</div>
		</div>
	);
}

export default Item;
