import type { CSSProperties, PointerEventHandler } from "react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import type {
  DragDirection,
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
): DragDirection | null => {
  const startSide = direction === "rtl" ? "right" : "left";
  const endSide = direction === "rtl" ? "left" : "right";

  if (Math.abs(mouseX - clientRect[startSide]) <= RESIZE_HANDLER_WIDTH / 2) {
    return "start";
  } else if (
    Math.abs(mouseX - clientRect[endSide]) <=
    RESIZE_HANDLER_WIDTH / 2
  ) {
    return "end";
  }

  return null;
};

const RESIZE_HANDLER_WIDTH = 20;

export default function useItem(props: UseItemProps) {
  const dataRef = useRef<object>();
  const dragStartX = useRef<number>();
  const [dragDirection, setDragDirection] = useState<DragDirection | null>();

  const {
    timeframe,
    overlayed,
    onResizeEnd,
    onResizeMove,
    onResizeStart,
    timelineDirection,
    millisecondsToPixels,
    getRelevanceFromDragEvent,
    getRelevanceFromResizeEvent,
  } = useTimelineContext();

  const onResizeEndCallback = useCallback(
    (event: ResizeEndEvent) => {
      onResizeEnd(event);
      props.onResizeEnd?.(event);
    },
    [onResizeEnd, props],
  );

  const onResizeStartCallback = useCallback(
    (event: ResizeStartEvent) => {
      onResizeStart?.(event);
      props.onResizeStart?.(event);
    },
    [onResizeStart, props],
  );

  const onResizeMoveCallback = useCallback(
    (event: ResizeMoveEvent) => {
      onResizeMove?.(event);
      props.onResizeMove?.(event);
    },
    [onResizeMove, props],
  );

  dataRef.current = {
    getRelevanceFromDragEvent,
    getRelevanceFromResizeEvent,
    relevance: props.relevance,
    ...(props.data || {}),
  };

  const draggableProps = useDraggable({
    id: props.id,
    data: dataRef.current,
    disabled: props.disabled,
  });

  const deltaX = millisecondsToPixels(
    props.relevance.start.getTime() - timeframe.start.getTime(),
  );

  const width = millisecondsToPixels(
    props.relevance.end.getTime() - props.relevance.start.getTime(),
  );

  const side = timelineDirection === "rtl" ? "right" : "left";

  const cursor = props.disabled
    ? "inherit"
    : draggableProps.isDragging
      ? "grabbing"
      : "grab";

  useLayoutEffect(() => {
    if (!dragDirection) return;

    const pointermoveHandler = (event: PointerEvent) => {
      if (!dragStartX.current || !draggableProps.node.current) return;

      const dragDeltaX =
        (event.clientX - dragStartX.current) *
        (timelineDirection === "rtl" ? -1 : 1);

      if (dragDirection === "start") {
        const newSideDelta = deltaX + dragDeltaX;
        draggableProps.node.current.style[side] = `${newSideDelta}px`;

        const newWidth = width + deltaX - newSideDelta;
        draggableProps.node.current.style.width = `${newWidth}px`;
      } else {
        const otherSideDelta = deltaX + width + dragDeltaX;
        const newWidth = otherSideDelta - deltaX;
        draggableProps.node.current.style.width = `${newWidth}px`;
      }

      onResizeMoveCallback({
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
    side,
    width,
    deltaX,
    props.id,
    dragDirection,
    timelineDirection,
    draggableProps.node,
    onResizeMoveCallback,
  ]);

  useLayoutEffect(() => {
    if (!dragDirection) return;

    const pointerupHandler = () => {
      if (!dragStartX.current || !draggableProps.node.current) return;

      let dragDeltaX = 0;

      if (dragDirection === "start") {
        const currentSideDelta = parseInt(
          draggableProps.node.current.style[side].slice(0, -2),
        );
        dragDeltaX = currentSideDelta - deltaX;
      } else {
        const currentWidth = parseInt(
          draggableProps.node.current.style.width.slice(0, -2),
        );
        dragDeltaX = currentWidth - width;
      }

      onResizeEndCallback({
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

      draggableProps.node.current.style.width = `${width}px`;
      draggableProps.node.current.style[side] = `${deltaX}px`;
    };

    window.addEventListener("pointerup", pointerupHandler);

    return () => {
      window.removeEventListener("pointerup", pointerupHandler);
    };
  }, [
    side,
    width,
    deltaX,
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
        timelineDirection,
      );

      if (newDragDirection) {
        draggableProps.node.current.style.cursor = "col-resize";
      } else {
        draggableProps.node.current.style.cursor = cursor;
      }
    },
    [draggableProps.node, props.disabled, timelineDirection, cursor],
  );

  const onPointerDown = useCallback<PointerEventHandler>(
    (event) => {
      if (!draggableProps.node.current || props.disabled) return;

      const newDragDirection = getDragDirection(
        event.clientX,
        draggableProps.node.current.getBoundingClientRect(),
        timelineDirection,
      );

      if (newDragDirection) {
        setDragDirection(newDragDirection);
        dragStartX.current = event.clientX;

        onResizeStartCallback({
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
      timelineDirection,
      draggableProps.node,
      onResizeStartCallback,
      draggableProps.listeners,
    ],
  );

  const paddingSide =
    timelineDirection === "rtl" ? "paddingRight" : "paddingLeft";

  const itemStyle: CSSProperties = {
    position: "absolute",
    top: 0,
    width,
    [side]: deltaX,
    cursor,
    height: "100%",
    touchAction: "none",
    ...(!(draggableProps.isDragging && overlayed) && {
      transform: CSS.Translate.toString(draggableProps.transform),
    }),
  };

  const itemContentStyle: CSSProperties = {
    height: "100%",
    display: "flex",
    overflow: "hidden",
    alignItems: "stretch",
    [paddingSide]: Math.max(0, -parseInt(itemStyle[side]?.toString() || "0")),
  };

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
