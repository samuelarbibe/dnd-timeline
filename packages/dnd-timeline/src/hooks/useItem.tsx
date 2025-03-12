import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { CSSProperties, PointerEventHandler } from "react";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";

import type {
	DragDirection,
	ItemData,
	ResizeEndEvent,
	ResizeMoveEvent,
	ResizeStartEvent,
	UseItemProps,
} from "../types";

import useTimelineContext from "./useTimelineContext";

const getDragDirection = (
	mouseX: number,
	clientRect: DOMRect,
	direction: CanvasDirection,
	resizeHandleWidth: number,
): DragDirection | null => {
	const startSide = direction === "rtl" ? "right" : "left";
	const endSide = direction === "rtl" ? "left" : "right";

	if (Math.abs(mouseX - clientRect[startSide]) <= resizeHandleWidth / 2) {
		return "start";
	}

	if (Math.abs(mouseX - clientRect[endSide]) <= resizeHandleWidth / 2) {
		return "end";
	}

	return null;
};

export default function useItem(props: UseItemProps) {
	const dataRef = useRef<ItemData>({} as ItemData);
	const dragStartX = useRef<number>();
	const [dragDirection, setDragDirection] = useState<DragDirection | null>();

	const {
		range,
		overlayed,
		onResizeEnd,
		onResizeMove,
		onResizeStart,
		direction,
		resizeHandleWidth,
		valueToPixels,
		getSpanFromDragEvent,
		getSpanFromResizeEvent,
	} = useTimelineContext();

	const propsOnResizeEnd = props.onResizeEnd;
	const propsOnResizeStart = props.onResizeStart;
	const propsOnResizeMove = props.onResizeMove;

	const onResizeEndCallback = useCallback(
		(event: ResizeEndEvent) => {
			onResizeEnd(event);
			propsOnResizeEnd?.(event);
		},
		[onResizeEnd, propsOnResizeEnd],
	);

	const onResizeStartCallback = useCallback(
		(event: ResizeStartEvent) => {
			onResizeStart?.(event);
			propsOnResizeStart?.(event);
		},
		[onResizeStart, propsOnResizeStart],
	);

	const onResizeMoveCallback = useCallback(
		(event: ResizeMoveEvent) => {
			onResizeMove?.(event);
			propsOnResizeMove?.(event);
		},
		[onResizeMove, propsOnResizeMove],
	);

	dataRef.current = {
		getSpanFromDragEvent,
		getSpanFromResizeEvent,
		span: props.span,
		...(props.data || {}),
	};

	const draggableProps = useDraggable({
		id: props.id,
		data: dataRef.current,
		disabled: props.disabled,
	});

	const deltaXStart = valueToPixels(props.span.start - range.start);

	const deltaXEnd = valueToPixels(range.end - props.span.end);

	const width = valueToPixels(props.span.end - props.span.start);

	const sideStart = direction === "rtl" ? "right" : "left";

	const sideEnd = direction === "rtl" ? "left" : "right";

	const cursor = props.disabled
		? "inherit"
		: draggableProps.isDragging
			? "grabbing"
			: "grab";

	useLayoutEffect(() => {
		if (!dragDirection) return;

		const pointermoveHandler = (event: globalThis.PointerEvent) => {
			if (!dragStartX.current || !draggableProps.node.current) return;

			const dragDeltaX =
				(event.clientX - dragStartX.current) * (direction === "rtl" ? -1 : 1);

			if (dragDirection === "start") {
				const newSideDelta = deltaXStart + dragDeltaX;
				draggableProps.node.current.style[sideStart] = `${newSideDelta}px`;

				const newWidth = width + deltaXStart - newSideDelta;
				draggableProps.node.current.style.width = `${newWidth}px`;
			} else {
				const otherSideDelta = deltaXStart + width + dragDeltaX;
				const newWidth = otherSideDelta - deltaXStart;
				draggableProps.node.current.style.width = `${newWidth}px`;
			}

			onResizeMoveCallback({
				activatorEvent: event,
				delta: {
					x: dragDeltaX,
				},
				direction: dragDirection,
				active: {
					id: props.id,
					data: dataRef,
				},
			});
		};

		window.addEventListener("pointermove", pointermoveHandler);

		return () => {
			window.removeEventListener("pointermove", pointermoveHandler);
		};
	}, [
		sideStart,
		width,
		deltaXStart,
		props.id,
		dragDirection,
		direction,
		draggableProps.node,
		onResizeMoveCallback,
	]);

	useLayoutEffect(() => {
		if (!dragDirection) return;

		const pointerupHandler = (event: globalThis.PointerEvent) => {
			if (!dragStartX.current || !draggableProps.node.current) return;

			let dragDeltaX = 0;

			if (dragDirection === "start") {
				const currentSideDelta = Number.parseInt(
					draggableProps.node.current.style[sideStart].slice(0, -2),
				);
				dragDeltaX = currentSideDelta - deltaXStart;
			} else {
				const currentWidth = Number.parseInt(
					draggableProps.node.current.style.width.slice(0, -2),
				);
				dragDeltaX = currentWidth - width;
			}

			onResizeEndCallback({
				activatorEvent: event,
				delta: {
					x: dragDeltaX,
				},
				direction: dragDirection,
				active: {
					id: props.id,
					data: dataRef,
				},
			});

			setDragDirection(null);

			if (draggableProps.node.current && draggableProps.node.current?.style) {
				draggableProps.node.current.style.width = `${width}px`;
				draggableProps.node.current.style[sideStart] = `${deltaXStart}px`;
			}
		};

		window.addEventListener("pointerup", pointerupHandler);

		return () => {
			window.removeEventListener("pointerup", pointerupHandler);
		};
	}, [
		sideStart,
		width,
		deltaXStart,
		props.id,
		dragDirection,
		draggableProps.node,
		onResizeEndCallback,
	]);

	const onPointerMove = useCallback<PointerEventHandler>(
		(event) => {
			if (!draggableProps.node.current || props.disabled) return;

			const newDragDirection = getDragDirection(
				event.clientX,
				draggableProps.node.current.getBoundingClientRect(),
				direction,
				resizeHandleWidth,
			);

			if (newDragDirection) {
				draggableProps.node.current.style.cursor = "col-resize";
			} else {
				draggableProps.node.current.style.cursor = cursor;
			}
		},
		[draggableProps.node, props.disabled, direction, cursor, resizeHandleWidth],
	);

	const onPointerDown = useCallback<PointerEventHandler>(
		(event) => {
			if (!draggableProps.node.current || props.disabled) return;

			const newDragDirection = getDragDirection(
				event.clientX,
				draggableProps.node.current.getBoundingClientRect(),
				direction,
				resizeHandleWidth,
			);

			if (newDragDirection) {
				setDragDirection(newDragDirection);
				dragStartX.current = event.clientX;

				onResizeStartCallback({
					activatorEvent: event as unknown as Event,
					active: {
						id: props.id,
						data: dataRef,
					},
					direction: newDragDirection,
				});
			} else {
				draggableProps.listeners?.onPointerDown(event);
			}
		},
		[
			props.id,
			props.disabled,
			direction,
			resizeHandleWidth,
			draggableProps.node,
			onResizeStartCallback,
			draggableProps.listeners,
		],
	);

	const paddingStart = direction === "rtl" ? "paddingRight" : "paddingLeft";

	const paddingEnd = direction === "rtl" ? "paddingLeft" : "paddingRight";

	const transform = CSS.Translate.toString(draggableProps.transform);

	const itemStyle: CSSProperties = useMemo(
		() => ({
			position: "absolute",
			top: 0,
			width,
			[sideStart]: deltaXStart,
			[sideEnd]: deltaXEnd,
			cursor,
			height: "100%",
			touchAction: "none",
			...(!(draggableProps.isDragging && overlayed) && {
				transform,
			}),
		}),
		[
			width,
			sideStart,
			deltaXStart,
			sideEnd,
			deltaXEnd,
			cursor,
			draggableProps.isDragging,
			overlayed,
			transform,
		],
	);

	const itemContentStyle: CSSProperties = useMemo(
		() => ({
			height: "100%",
			display: "flex",
			overflow: "hidden",
			alignItems: "stretch",
			[paddingStart]: Math.max(0, -deltaXStart),
			[paddingEnd]: Math.max(0, -deltaXEnd),
		}),
		[paddingStart, paddingEnd, deltaXStart, deltaXEnd],
	);

	return {
		itemStyle,
		itemContentStyle,
		...draggableProps,
		listeners: {
			...draggableProps.listeners,
			onPointerDown,
			onPointerMove,
		},
	};
}
