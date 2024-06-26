import React, { memo, useRef, useLayoutEffect } from "react";

import { useTimelineContext } from "dnd-timeline";

interface TimeCursorProps {
	interval?: number;
}

function TimeCursor(props: TimeCursorProps) {
	const timeCursorRef = useRef<HTMLDivElement>(null);

	const { range, direction, sidebarWidth, valueToPixels } =
		useTimelineContext();

	const side = direction === "rtl" ? "right" : "left";

	const isVisible =
		new Date().getTime() > range.start && new Date().getTime() < range.end;

	useLayoutEffect(() => {
		if (!isVisible) return;

		const offsetCursor = () => {
			if (!timeCursorRef.current) return;
			const timeDelta = new Date().getTime() - range.start;
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
