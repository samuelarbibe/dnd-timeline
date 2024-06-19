import type { ItemDefinition } from "../types";

export const validateItems = (item: ItemDefinition) =>
	item.span.end > item.span.start;
