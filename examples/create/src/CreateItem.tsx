import { type Span, useTimelineContext } from "dnd-timeline";
import { useEffect, useMemo, useRef } from "react";

interface ItemProps {
	startX: number;
	onCreateEnd: (span: Span) => void;
}

function CreateItem(props: ItemProps) {
	const ref = useRef<HTMLDivElement | null>(null);
	const endX = useRef<number>();

	const { getDeltaXFromScreenX, getValueFromScreenX } = useTimelineContext();

	const left = useMemo(
		() => getDeltaXFromScreenX(props.startX),
		[getDeltaXFromScreenX, props.startX],
	);

	useEffect(() => {
		if (!ref.current) return;

		const pointerMoveHandler = (event: PointerEvent) => {
			if (!ref.current) return;
			endX.current = event.clientX;

			const width = endX.current - props.startX;
			ref.current.style.width = `${width}px`;
		};

		const pointerUpHandler = () => {
			if (!endX.current) return;

			const span: Span = {
				start: getValueFromScreenX(props.startX),
				end: getValueFromScreenX(endX.current),
			};
			props.onCreateEnd(span);
		};

		window.addEventListener("pointermove", pointerMoveHandler);
		window.addEventListener("pointerup", pointerUpHandler);

		return () => {
			window.removeEventListener("pointermove", pointerMoveHandler);
			window.removeEventListener("pointerup", pointerUpHandler);
		};
	}, [props.onCreateEnd, props.startX, getValueFromScreenX]);

	return (
		<div
			ref={ref}
			style={{
				border: "1px solid white",
				height: "100%",
				overflow: "hidden",
				position: "absolute",
				width: 0,
				left,
			}}
		>
			Creating...
		</div>
	);
}

export default CreateItem;
