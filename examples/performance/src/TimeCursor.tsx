import { useTimelineContext } from "dnd-timeline";
import { memo, useLayoutEffect, useRef } from "react";

interface TimeCursorProps {
	interval?: number;
}

function TimeCursor(props: TimeCursorProps) {
	const timeCursorRef = useRef<HTMLDivElement>(null);

	const { range, direction, sidebarWidth, valueToPixels } =
		useTimelineContext();

	const side = direction === "rtl" ? "right" : "left";

	const isVisible = Date.now() > range.start && Date.now() < range.end;

	useLayoutEffect(() => {
		if (!isVisible) return;

		const offsetCursor = () => {
			if (!timeCursorRef.current) return;
			const timeDelta = Date.now() - range.start;
			const timeDeltaInPixels = valueToPixels(timeDelta);

			const sideDelta = sidebarWidth + timeDeltaInPixels;
			timeCursorRef.current.style[side] = `${sideDelta}px`;
		};

		offsetCursor();

		const interval = setInterval(offsetCursor, props.interval || 1000);

		return () => {
			clearInterval(interval);
		};
	}, [
		side,
		sidebarWidth,
		props.interval,
		range.start,
		valueToPixels,
		isVisible,
	]);

	if (!isVisible) return null;

	return (
		<div
			ref={timeCursorRef}
			style={{
				height: "100%",
				width: "1px",
				zIndex: 3,
				backgroundColor: "red",
				position: "absolute",
			}}
		/>
	);
}

export default memo(TimeCursor);
