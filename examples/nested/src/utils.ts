import { minutesToMilliseconds } from "date-fns";
import type { ItemDefinition, Range, RowDefinition, Span } from "dnd-timeline";
import { nanoid } from "nanoid";
import type { GroupedRowDefinition } from "./App";

interface GenerateRowsOptions {
	disabled?: boolean;
}

export const generateRows = (
	count: number,
	groupOptions: string[],
	options?: GenerateRowsOptions,
) => {
	return Array(count)
		.fill(0)
		.map((): GroupedRowDefinition => {
			const disabled = options?.disabled;

			let id = `row-${nanoid(4)}`;
			if (disabled) id += " (disabled)";

			const groupIndex = Math.round(Math.random() * (groupOptions.length - 1));
			console.log(groupIndex);
			const group = groupOptions[groupIndex];

			return {
				id,
				group,
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
	rows: GroupedRowDefinition[],
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
