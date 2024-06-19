import type { ItemDefinition, Span } from "../types";

export const groupItemsToSubrows = <T extends ItemDefinition = ItemDefinition>(
	items: T[],
	span?: Span,
) => {
	const sortedItems = [...items];
	sortedItems.sort((a, b) => (a.span.start > b.span.start ? 1 : -1));

	return sortedItems.reduce<Record<string, T[][]>>((acc, item) => {
		if (span && (item.span.start >= span.end || item.span.end <= span.start))
			return acc;

		if (!acc[item.rowId]) {
			acc[item.rowId] = [[item]];
			return acc;
		}

		for (let index = 0; index < acc[item.rowId].length; index++) {
			const currentSubrow = acc[item.rowId][index];
			const lastItemInSubrow = currentSubrow[currentSubrow.length - 1];
			if (item.span.start >= lastItemInSubrow.span.end) {
				acc[item.rowId][index].push(item);
				return acc;
			}
		}

		acc[item.rowId].push([item]);
		return acc;
	}, {});
};

export const groupItemsToRows = <T extends ItemDefinition = ItemDefinition>(
	items: T[],
	span?: Span,
) => {
	return items.reduce<Record<string, T[]>>((acc, item) => {
		if (span && (item.span.start >= span.end || item.span.end <= span.start))
			return acc;

		if (!acc[item.rowId]) {
			acc[item.rowId] = [item];
		} else {
			acc[item.rowId].push(item);
		}

		return acc;
	}, {});
};
