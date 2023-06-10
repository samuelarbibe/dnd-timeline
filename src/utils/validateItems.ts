import { Item } from '../hooks/useItem'

export const validateItems = (item: Item) =>
	item.relevance.end > item.relevance.start
