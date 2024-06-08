import type { ItemDefinition } from "../types";

export const validateItems = (item: ItemDefinition) =>
	item.relevance.end > item.relevance.start;
