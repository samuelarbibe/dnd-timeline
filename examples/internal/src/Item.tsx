import { hoursToMilliseconds } from "date-fns";
import { useItem, useTimelineContext } from "dnd-timeline";
import type { Span } from "dnd-timeline";
import type React from "react";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";

interface ItemProps {
	id: string;
	span: Span;
	children: React.ReactNode;
}

function Item(props: ItemProps) {
	const internalRef = useRef<HTMLDivElement | null>(null);

	// this should be persisted, not on local state, but in the actual data.
	// call a callback you received from props? perform update here? whatever feels right.
	const [startDelta, setStartDelta] = useState(hoursToMilliseconds(0.5));
	const [endDelta, setEndDelta] = useState(hoursToMilliseconds(0.5));

	const { valueToPixels, pixelsToValue } = useTimelineContext();

	const { setNodeRef, attributes, listeners, itemStyle, itemContentStyle } =
		useItem({
			id: props.id,
			span: props.span,
		});

	const customOnPointerDown = useCallback<React.PointerEventHandler>(
		(e) => {
			const target = internalRef.current;
			if (!target) return;

			const rect = target.getBoundingClientRect();
			const x = e.clientX - rect.left;

			// am I dragging the internal item?
			const isResizingLeft = x <= 20 && x > 0;
			const isResizingRight = x >= rect.width - 20 && x <= rect.width;

			// if not dragging internal item, handle event on parent.
			// add more rules if you wish... like:
			// am i NOT dragging on the parent? am I overflowing the parent? etc...
			if (!isResizingLeft && !isResizingRight) {
				return listeners.onPointerDown(e);
			} else {
				const startX = e.clientX;
				let lastDelta = 0;

				// animate the dragging without actually re-rendering
				const pointerMoveHandler = (moveEvent: PointerEvent) => {
					const dx = moveEvent.clientX - startX;
					lastDelta = dx;
					if (isResizingLeft) {
						target.style.marginLeft = `${valueToPixels(startDelta) + dx}px`;
					} else if (isResizingRight) {
						target.style.marginRight = `${valueToPixels(endDelta) - dx}px`;
					}
				};

				// submit the event and update state
				const pointerUpHandler = () => {
					if (isResizingLeft) {
						setStartDelta((prev) => prev + pixelsToValue(lastDelta));
					} else if (isResizingRight) {
						setEndDelta((prev) => prev - pixelsToValue(lastDelta));
					}
					document.removeEventListener("pointermove", pointerMoveHandler);
					document.removeEventListener("pointerup", pointerUpHandler);
				};

				document.addEventListener("pointermove", pointerMoveHandler);
				document.addEventListener("pointerup", pointerUpHandler);
			}
		},
		[
			listeners.onPointerDown,
			startDelta,
			endDelta,
			valueToPixels,
			pixelsToValue,
		],
	);

	return (
		<div
			ref={setNodeRef}
			style={itemStyle}
			{...listeners}
			onPointerDown={customOnPointerDown}
			{...attributes}
		>
			<div style={itemContentStyle}>
				<div
					style={{
						border: "1px solid white",
						width: "100%",
						overflow: "hidden",
					}}
				>
					<div
						ref={internalRef}
						style={{
							border: "1px solid white",
							height: "100%",
							marginLeft: valueToPixels(startDelta),
							marginRight: valueToPixels(endDelta),
							overflow: "hidden",
						}}
					>
						{props.children}
					</div>
				</div>
			</div>
		</div>
	);
}

export default Item;
