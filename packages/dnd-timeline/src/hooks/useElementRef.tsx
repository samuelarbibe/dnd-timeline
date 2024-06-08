import { useCallback, useRef, useState } from "react";
import ResizeObserver from "resize-observer-polyfill";

export default function useElementRef() {
	const ref = useRef<HTMLElement | null>(null);
	const [width, setWidth] = useState(0);
	const [direction, setDirection] = useState<CanvasDirection>("ltr");

	const resizeObserver = useRef<ResizeObserver>();

	const setRef = useCallback((element: HTMLElement | null) => {
		if (element !== ref.current) {
			resizeObserver.current?.disconnect();

			if (element) {
				resizeObserver.current = new ResizeObserver((entries) => {
					for (const entry of entries) {
						setWidth(entry.contentRect.width);
					}
				});

				resizeObserver.current.observe(element);

				setDirection(getComputedStyle(element).direction as CanvasDirection);
			}
		}
		ref.current = element;
	}, []);

	return {
		ref,
		setRef,
		width,
		direction,
	};
}
