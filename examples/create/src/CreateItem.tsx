import type { DragDirection, Span } from "dnd-timeline";
import { useTimelineContext } from "dnd-timeline";
import { useCallback, useEffect, useMemo, useRef } from "react";

interface ItemProps {
	startX: number;
	onCreateEnd: (span: Span) => void;
	normalizeSpan: (span: Span, direction: DragDirection) => Span | null;
}

function CreateItem(props: ItemProps) {
	const ref = useRef<HTMLDivElement | null>(null);
	const endX = useRef<number>();

	const {
		direction,
		range,
		getDeltaXFromScreenX,
		getValueFromScreenX,
		valueToPixels,
	} = useTimelineContext();

	const sideStart = direction === "rtl" ? "right" : "left";

	const getSpanFromScreenX = useCallback(
		(startX: number, currentX: number): Span | null => {
			const startValue = getValueFromScreenX(startX);
			const currentValue = getValueFromScreenX(currentX);

			const dragDirection: DragDirection =
				currentValue < startValue ? "start" : "end";

			const rawSpan: Span =
				startValue <= currentValue
					? { start: startValue, end: currentValue }
					: { start: currentValue, end: startValue };

			return props.normalizeSpan(rawSpan, dragDirection);
		},
		[getValueFromScreenX, props.normalizeSpan],
	);

	const applySpanToPreview = useCallback(
		(span: Span) => {
			if (!ref.current) return;

			const startOffset = valueToPixels(span.start - range.start);
			const width = valueToPixels(span.end - span.start);

			ref.current.style[sideStart] = `${startOffset}px`;
			ref.current.style.width = `${width}px`;
		},
		[range.start, sideStart, valueToPixels],
	);

	const left = useMemo(
		() => getDeltaXFromScreenX(props.startX),
		[getDeltaXFromScreenX, props.startX],
	);

	useEffect(() => {
		if (!ref.current) return;

		const pointerMoveHandler = (event: PointerEvent) => {
			if (!ref.current) return;
			endX.current = event.clientX;
			const span = getSpanFromScreenX(props.startX, endX.current);
			if (!span) return;
			applySpanToPreview(span);
		};

		const pointerUpHandler = () => {
			if (endX.current === undefined) return;

			const span = getSpanFromScreenX(props.startX, endX.current);
			if (!span) return;
			props.onCreateEnd(span);
		};

		window.addEventListener("pointermove", pointerMoveHandler);
		window.addEventListener("pointerup", pointerUpHandler);

		return () => {
			window.removeEventListener("pointermove", pointerMoveHandler);
			window.removeEventListener("pointerup", pointerUpHandler);
		};
	}, [applySpanToPreview, getSpanFromScreenX, props.onCreateEnd, props.startX]);

	return (
		<div
			ref={ref}
			style={{
				border: "1px solid white",
				height: "100%",
				overflow: "hidden",
				position: "absolute",
				width: 0,
				[sideStart]: left,
			}}
		>
			Creating...
		</div>
	);
}

export default CreateItem;
