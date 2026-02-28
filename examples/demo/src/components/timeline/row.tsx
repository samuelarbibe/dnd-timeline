import type { RowDefinition } from "dnd-timeline";
import { useRow } from "dnd-timeline";
import type React from "react";

interface RowProps extends RowDefinition {
	children: React.ReactNode;
	sidebar: React.ReactNode;
}

function Row(props: RowProps) {
	const { setNodeRef, rowWrapperStyle, rowStyle, rowSidebarStyle } = useRow({
		id: props.id,
	});

	return (
		<div
			className="border-b w-full"
			style={{
				...rowWrapperStyle,
				minHeight: 50,
			}}
		>
			<div style={rowSidebarStyle}>{props.sidebar}</div>
			<div ref={setNodeRef} style={rowStyle}>
				{props.children}
			</div>
		</div>
	);
}

export default Row;
