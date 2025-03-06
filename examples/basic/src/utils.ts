import { useDndContext } from "@dnd-kit/core";
import { minutesToMilliseconds } from "date-fns";
import type {
	ItemDefinition,
	PanEndEvent,
	Range,
	RowDefinition,
	Span,
	UsePanStrategy,
} from "dnd-timeline";
import { nanoid } from "nanoid";
import { useEffect, useLayoutEffect, useRef } from "react";

interface GenerateRowsOptions {
	disabled?: boolean;
}

export const generateRows = (count: number, options?: GenerateRowsOptions) => {
	return Array(count)
		.fill(0)
		.map((): RowDefinition => {
			const disabled = options?.disabled;

			let id = `row-${nanoid(4)}`;
			if (disabled) id += " (disabled)";

			return {
				id,
				disabled,
			};
		});
};

const getRandomInRange = (min: number, max: number) => {
	return Math.random() * (max - min) + min;
};

const DEFAULT_MIN_LENGTH = minutesToMilliseconds(60);
const DEFAULT_MAX_LENGTH = minutesToMilliseconds(360);

export const generateRandomSpan = (
	range: Range,
	minLength: number = DEFAULT_MIN_LENGTH,
	maxLength: number = DEFAULT_MAX_LENGTH,
): Span => {
	const duration = getRandomInRange(minLength, maxLength);

	const start = getRandomInRange(range.start, range.end - duration);

	const end = start + duration;

	return {
		start: start,
		end: end,
	};
};

interface GenerateItemsOptions {
	disabled?: boolean;
	background?: boolean;
	minLength?: number;
	maxLength?: number;
}

export const generateItems = (
	count: number,
	range: Range,
	rows: RowDefinition[],
	options?: GenerateItemsOptions,
) => {
	return Array(count)
		.fill(0)
		.map((): ItemDefinition => {
			const row = rows[Math.ceil(Math.random() * rows.length - 1)];
			const rowId = row.id;
			const disabled = row.disabled || options?.disabled;

			const span = generateRandomSpan(
				range,
				options?.minLength,
				options?.maxLength,
			);

			let id = `item-${nanoid(4)}`;
			if (disabled) id += " (disabled)";

			return {
				id,
				rowId,
				span,
				disabled,
			};
		});
};

export const useOverflowPanStrategy: UsePanStrategy = (
	timelineContext,
	onPanEnd,
) => {
	const { active } = useDndContext();
	const { timelineRef, sidebarWidth } = timelineContext;

	const panSpeedRef = useRef<number>(0);

	useLayoutEffect(() => {
		if (!active) return;

		// instead of an interval, you can use requestAnimationFrame()
		const interval = setInterval(() => {
			if (panSpeedRef.current) {
				const panEndEvent: PanEndEvent = {
					deltaX: panSpeedRef.current,
					deltaY: 0,
				};

				onPanEnd(panEndEvent);
			}
		}, 50);

		return () => {
			clearInterval(interval);
		};
	}, [onPanEnd, active]);

	useLayoutEffect(() => {
		const element = timelineRef?.current;
		if (!active || !element) return;

		const moveHandler = (event: PointerEvent) => {
			event.preventDefault();

			const overflowLeft =
				element.getBoundingClientRect().left + sidebarWidth - event.clientX;

			const overflowRight =
				event.clientX - element.getBoundingClientRect().right;

			let panSpeed = 0;
			const panAcceleration = 0.05;

			if (overflowLeft > 0) {
				panSpeed = -overflowLeft * panAcceleration;
			} else if (overflowRight > 0) {
				panSpeed = overflowRight * panAcceleration;
			}

			panSpeedRef.current = panSpeed;
		};

		window.addEventListener("pointermove", moveHandler);

		return () => {
			window.removeEventListener("pointermove", moveHandler);
		};
	}, [timelineRef, sidebarWidth, active]);
};
