import type { ItemDefinition, Timeframe } from "../types";

export const groupItemsToSubrows = <T extends ItemDefinition = ItemDefinition>(
	items: T[],
	timeframe?: Timeframe,
) => {
	const sortedItems = [...items];
	sortedItems.sort((a, b) => (a.relevance.start > b.relevance.start ? 1 : -1));

	return sortedItems.reduce<Record<string, T[][]>>((acc, item) => {
		if (
			timeframe &&
			(item.relevance.start >= timeframe.end ||
				item.relevance.end <= timeframe.start)
		)
			return acc;

		if (!acc[item.rowId]) {
			acc[item.rowId] = [[item]];
			return acc;
		}

		for (let index = 0; index < acc[item.rowId].length; index++) {
			const currentSubrow = acc[item.rowId][index];
			const lastItemInSubrow = currentSubrow[currentSubrow.length - 1];
			if (item.relevance.start >= lastItemInSubrow.relevance.end) {
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
	timeframe?: Timeframe,
) => {
	return items.reduce<Record<string, T[]>>((acc, item) => {
		if (
			timeframe &&
			(item.relevance.start >= timeframe.end ||
				item.relevance.end <= timeframe.start)
		)
			return acc;

		if (!acc[item.rowId]) {
			acc[item.rowId] = [item];
		} else {
			acc[item.rowId].push(item);
		}

		return acc;
	}, {});
};
