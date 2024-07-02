import { useEffect, useState } from "react";

interface UseAutoScrollOptions {
	acceleration: number;
	threshold: number;
}

interface DragOverlay {
	nodeRef: React.MutableRefObject<HTMLElement | null>;
}

interface UseAutoScrollProps {
	containerRef: React.MutableRefObject<HTMLElement | null>;
	dragOverlay: DragOverlay;
	options?: Partial<UseAutoScrollOptions>;
}

const DEFAULT_OPTIONS: UseAutoScrollOptions = {
	acceleration: 10,
	threshold: 100,
};

export const useAutoscroll = (props: UseAutoScrollProps) => {
	const [scroll, setScroll] = useState<number>(0);

	const options = {
		...DEFAULT_OPTIONS,
		...props.options,
	};

	useEffect(() => {
		const node = props.dragOverlay.nodeRef.current;
		const container = props.containerRef.current;

		if (!node || !container) return;

		const handleMouseMove = (event: MouseEvent) => {
			const { clientY } = event;

			const { top, bottom } = container.getBoundingClientRect();

			const distanceFromTopThreshold = top + options.threshold - clientY;
			const distanceFromBottomThreshold =
				clientY - (bottom - options.threshold);

			if (distanceFromTopThreshold > 0) {
				setScroll(
					-(distanceFromTopThreshold / options.threshold) *
						options.acceleration,
				);
			} else if (distanceFromBottomThreshold > 0) {
				setScroll(
					(distanceFromBottomThreshold / options.threshold) *
						options.acceleration,
				);
			} else {
				setScroll(0);
			}
		};

		node.addEventListener("mousemove", handleMouseMove);

		return () => {
			setScroll(0);
			node.removeEventListener("mousemove", handleMouseMove);
		};
	}, [
		props.dragOverlay,
		props.containerRef.current,
		options.acceleration,
		options.threshold,
	]);

	useEffect(() => {
		const container = props.containerRef.current;
		if (!container) return;

		const scrollContainer = () => {
			container.scrollTop += scroll;
		};

		const scrollInterval = setInterval(scrollContainer, 10);

		return () => clearInterval(scrollInterval);
	}, [props.containerRef, scroll]);
};
