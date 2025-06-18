import { minutesToMilliseconds } from "date-fns";
import type { ItemDefinition, Range, RowDefinition, Span } from "dnd-timeline";
import { nanoid } from "nanoid";

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

export interface Cluster extends ItemDefinition {
	items: ItemDefinition[];
}

export function clusterItems(
	items: ItemDefinition[],
	range: Range,
	closenessFactor = 0.05,
): Cluster[] {
	const sorted = [...items].sort((a, b) =>
		a.rowId !== b.rowId
			? a.rowId.localeCompare(b.rowId)
			: a.span.start - b.span.start,
	);
	const maxDistance = (range.end - range.start) * closenessFactor;

	const clusters: Cluster[] = [];
	let currentCluster: Cluster | null = null;

	for (const item of sorted) {
		if (!currentCluster) {
			currentCluster = {
				rowId: item.rowId,
				id: item.id,
				items: [item],
				span: { ...item.span },
			};
			continue;
		}

		const lastItem = currentCluster.items[currentCluster.items.length - 1];
		const distance = item.span.start - lastItem.span.end;

		if (
			distance <= maxDistance &&
			distance > 0 &&
			item.rowId === currentCluster.rowId
		) {
			currentCluster.items.push(item);
			currentCluster.span.end = Math.max(
				currentCluster.span.end,
				item.span.end,
			);
		} else {
			clusters.push(currentCluster);
			currentCluster = {
				rowId: item.rowId,
				id: item.id,
				items: [item],
				span: { ...item.span },
			};
		}
	}

	if (currentCluster) {
		clusters.push(currentCluster);
	}

	return clusters;
}
