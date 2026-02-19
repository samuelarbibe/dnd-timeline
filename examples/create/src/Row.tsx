import type { DragDirection, RowDefinition, Span } from "dnd-timeline";
import { useRow } from "dnd-timeline";
import type React from "react";
import { type PointerEvent, useCallback, useState } from "react";
import CreateItem from "./CreateItem";

interface RowProps extends RowDefinition {
	children: React.ReactNode;
	sidebar: React.ReactNode;
	onCreateItem: (span: Span, rowId: string) => void;
	normalizeCreateSpan: (span: Span, direction: DragDirection) => Span | null;
}

function Row(props: RowProps) {
	const {
		setNodeRef,
		setSidebarRef,
		rowWrapperStyle,
		rowStyle,
		rowSidebarStyle,
	} = useRow({ id: props.id });

	const [dragStartX, setDragStartX] = useState<number | null>(null);

	const handleOnPointerDown = (event: PointerEvent) => {
		setDragStartX(event.clientX);
	};

	const handleOnCreateEnd = useCallback(
		(span: Span) => {
			props.onCreateItem(span, props.id);
			setDragStartX(null);
		},
		[props.onCreateItem, props.id],
	);

	return (
		<div style={{ ...rowWrapperStyle, minHeight: 50 }}>
			<div ref={setSidebarRef} style={rowSidebarStyle}>
				{props.sidebar}
			</div>
			<div
				ref={setNodeRef}
				style={{ ...rowStyle, border: "1px solid grey" }}
				onPointerDown={handleOnPointerDown}
			>
				{props.children}
				{dragStartX && (
					<CreateItem
						startX={dragStartX}
						onCreateEnd={handleOnCreateEnd}
						normalizeSpan={props.normalizeCreateSpan}
					/>
				)}
			</div>
		</div>
	);
}

export default Row;
