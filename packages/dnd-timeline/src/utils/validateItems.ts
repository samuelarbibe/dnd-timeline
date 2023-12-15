import type { ItemDefinition } from "../hooks/useItem";

export const validateItems = (item: ItemDefinition) =>
  item.relevance.end > item.relevance.start;
