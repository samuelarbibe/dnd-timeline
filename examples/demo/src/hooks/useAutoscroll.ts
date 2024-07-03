import { useDndMonitor } from "@dnd-kit/core";
import { useTimelineContext } from "dnd-timeline";
import { useEffect, useRef, useState } from "react";

interface UseAutoScrollProps {
	acceleration: number;
	threshold: number;
}

const DEFAULT_OPTIONS: UseAutoScrollProps = {
	acceleration: 10,
	threshold: 100,
};

export const useAutoscroll = (props: Partial<UseAutoScrollProps> = {}) => {
	const [scroll, setScroll] = useState(false);
	const scrollSpeedRef = useRef<number>(0);
	const { timelineRef } = useTimelineContext();

	const options = {
		...DEFAULT_OPTIONS,
		...props,
	};

	useDndMonitor({
		onDragMove: (event) => {
			const container = timelineRef.current;
			const clientY = event.active.rect.current.translated?.top;

			if (!container || !clientY) return;

			const { top, bottom } = container.getBoundingClientRect();

			const distanceFromTopThreshold = top + options.threshold - clientY;
			const distanceFromBottomThreshold =
				clientY - (bottom - options.threshold);

			if (distanceFromTopThreshold > 0) {
				scrollSpeedRef.current =
					-(distanceFromTopThreshold / options.threshold) *
					options.acceleration;
			} else if (distanceFromBottomThreshold > 0) {
				scrollSpeedRef.current =
					(distanceFromBottomThreshold / options.threshold) *
					options.acceleration;
			} else {
				scrollSpeedRef.current = 0;
			}

			setScroll(!!scrollSpeedRef.current);
		},
		onDragCancel() {
			setScroll(false);
		},
		onDragEnd() {
			setScroll(false);
		},
	});

	useEffect(() => {
		const container = timelineRef.current;
		if (!container || !scroll) return;

		const scrollContainer = () => {
			container.scrollTop += scrollSpeedRef.current;
		};

		const scrollInterval = setInterval(scrollContainer, 10);

		return () => clearInterval(scrollInterval);
	}, [timelineRef, scroll]);
};
