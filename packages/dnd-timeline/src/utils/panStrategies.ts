import { useLayoutEffect, useRef } from "react";

import type { OnPanEnd, PanEndEvent } from "../types";

export type UsePanStrategy = (
	timelineRef: React.MutableRefObject<HTMLElement | null>,
	onPanEnd: OnPanEnd,
) => void;

export const useWheelStrategy: UsePanStrategy = (timelineRef, onPanEnd) => {
	useLayoutEffect(() => {
		const element = timelineRef.current;
		if (!element) return;

		const pointerWheelHandler = (event: WheelEvent) => {
			if (!event.ctrlKey && !event.metaKey) return;

			event.preventDefault();

			const isHorizontal = event.shiftKey;

			const panEndEvent: PanEndEvent = {
				clientX: event.clientX,
				clientY: event.clientY,
				deltaX: isHorizontal ? event.deltaX || event.deltaY : 0,
				deltaY: isHorizontal ? 0 : event.deltaY,
			};

			onPanEnd(panEndEvent);
		};

		element.addEventListener("wheel", pointerWheelHandler, { passive: false });

		return () => {
			element.removeEventListener("wheel", pointerWheelHandler);
		};
	}, [onPanEnd, timelineRef]);
};

export const useDragStrategy: UsePanStrategy = (timelineRef, onPanEnd) => {
	const lastDragX = useRef<number | null>(null);

	useLayoutEffect(() => {
		const element = timelineRef.current;
		if (!element) return;

		const pointerWheelHandler = (event: WheelEvent) => {
			if (!event.ctrlKey && !event.metaKey) return;

			event.preventDefault();

			const isHorizontal = event.shiftKey;

			const panEndEvent: PanEndEvent = {
				clientX: event.clientX,
				clientY: event.clientY,
				deltaX: 0,
				deltaY: isHorizontal ? 0 : event.deltaY,
			};

			onPanEnd(panEndEvent);
		};

		element.addEventListener("wheel", pointerWheelHandler, { passive: false });

		return () => {
			element.removeEventListener("wheel", pointerWheelHandler);
		};
	}, [onPanEnd, timelineRef]);

	useLayoutEffect(() => {
		const element = timelineRef.current;
		if (!element) return;

		const pointerdownHandler = (event: MouseEvent) => {
			if (!event.ctrlKey && !event.metaKey) return;

			lastDragX.current = event.clientX;
		};

		const pointerupHandler = () => {
			lastDragX.current = null;
		};

		const pointermoveHandler = (event: MouseEvent) => {
			if (!lastDragX.current) return;

			const deltaX = event.clientX - lastDragX.current;

			lastDragX.current = event.clientX;

			const panEndEvent: PanEndEvent = {
				deltaX: -deltaX,
				deltaY: 0,
			};

			onPanEnd(panEndEvent);
		};

		element.addEventListener("pointerup", pointerupHandler);
		element.addEventListener("pointerdown", pointerdownHandler);
		element.addEventListener("pointermove", pointermoveHandler);
		element.addEventListener("pointerleave", pointerupHandler);

		return () => {
			element.removeEventListener("pointerup", pointerupHandler);
			element.removeEventListener("pointerdown", pointerdownHandler);
			element.removeEventListener("pointermove", pointermoveHandler);
			element.removeEventListener("pointerleave", pointerupHandler);
		};
	}, [onPanEnd, timelineRef]);
};
