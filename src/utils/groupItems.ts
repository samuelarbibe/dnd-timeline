import { isAfter } from 'date-fns'

import { Timeframe } from '../types'
import { Item } from '../hooks/useItem'

export const groupItemsToSubrows = (items: Item[], timeframe?: Timeframe) => {
	const sortedItems = [...items]
	sortedItems.sort((a, b) =>
		isAfter(a.relevance.start, b.relevance.start) ? 1 : -1
	)

	return sortedItems.reduce((acc, item) => {
		if (
			item.background ||
			(timeframe &&
				(item.relevance.start >= timeframe.end ||
					item.relevance.end <= timeframe.start))
		)
			return acc

		if (!acc[item.rowId]) {
			acc[item.rowId] = [[item]]
			return acc
		}

		for (let index = 0; index < acc[item.rowId].length; index++) {
			const currentSubrow = acc[item.rowId][index]
			const lastItemInRow = currentSubrow[currentSubrow.length - 1]
			if (isAfter(item.relevance.start, lastItemInRow.relevance.end)) {
				acc[item.rowId][index].push(item)
				return acc
			}
		}

		acc[item.rowId].push([item])
		return acc
	}, {} as Record<string, Item[][]>)
}

export const groupItemsToRows = (items: Item[], timeframe?: Timeframe) => {
	return items.reduce((acc, item) => {
		if (
			timeframe &&
			(item.relevance.start >= timeframe.end ||
				item.relevance.end <= timeframe.start)
		)
			return acc

		if (!acc[item.rowId]) {
			acc[item.rowId] = [item]
		} else {
			acc[item.rowId].push(item)
		}

		return acc
	}, {} as Record<string, Item[]>)
}
