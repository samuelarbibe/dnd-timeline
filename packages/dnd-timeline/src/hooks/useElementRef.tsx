import { type MutableRefObject, useCallback, useRef, useState } from "react";
import ResizeObserver from "resize-observer-polyfill";

export default function useElementRef() {
	const [ref, setRef] = useState<MutableRefObject<HTMLElement | null>>({
		current: null,
	});
	const [width, setWidth] = useState(0);
	const [direction, setDirection] = useState<CanvasDirection>("ltr");

	const resizeObserver = useRef<ResizeObserver>();

	const onSetRef = useCallback((element: HTMLElement | null) => {
		resizeObserver.current?.disconnect();

		if (element) {
			resizeObserver.current = new ResizeObserver((entries) => {
				setWidth(entries[0].contentRect.width);
			});

			resizeObserver.current.observe(element);

			setDirection(getComputedStyle(element).direction as CanvasDirection);
		}

		setRef({ current: element });
	}, []);

	return {
		ref,
		setRef: onSetRef,
		width,
		direction,
	};
}
