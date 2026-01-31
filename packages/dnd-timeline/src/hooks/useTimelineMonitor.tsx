import type {
	DragCancelEvent,
	DragEndEvent,
	DragMoveEvent,
	DragOverEvent,
	DragStartEvent,
} from "@dnd-kit/core";
import { useDndMonitor } from "@dnd-kit/core";
import { useEffect } from "react";
import type {
	ResizeEndEvent,
	ResizeMoveEvent,
	ResizeStartEvent,
} from "../types";
import useTimelineContext from "./useTimelineContext";

export interface UseTimelineMonitorArguments {
	onDragStart?: (event: DragStartEvent) => void;
	onDragMove?: (event: DragMoveEvent) => void;
	onDragOver?: (event: DragOverEvent) => void;
	onDragEnd?: (event: DragEndEvent) => void;
	onDragCancel?: (event: DragCancelEvent) => void;
	onResizeStart?: (event: ResizeStartEvent) => void;
	onResizeMove?: (event: ResizeMoveEvent) => void;
	onResizeEnd?: (event: ResizeEndEvent) => void;
}

export default function useTimelineMonitor({
	onDragStart,
	onDragMove,
	onDragOver,
	onDragEnd,
	onDragCancel,
	onResizeStart,
	onResizeMove,
	onResizeEnd,
}: UseTimelineMonitorArguments) {
	useDndMonitor({
		onDragStart,
		onDragMove,
		onDragOver,
		onDragEnd,
		onDragCancel,
	});

	const { addResizeListener } = useTimelineContext();

	useEffect(() => {
		if (!onResizeStart) return;
		return addResizeListener("resizeStart", onResizeStart);
	}, [addResizeListener, onResizeStart]);

	useEffect(() => {
		if (!onResizeMove) return;
		return addResizeListener("resizeMove", onResizeMove);
	}, [addResizeListener, onResizeMove]);

	useEffect(() => {
		if (!onResizeEnd) return;
		return addResizeListener("resizeEnd", onResizeEnd);
	}, [addResizeListener, onResizeEnd]);
}
