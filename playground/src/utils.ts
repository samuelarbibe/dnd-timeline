import {
	startOfDay,
	addMilliseconds,
	hoursToMilliseconds,
	minutesToMilliseconds,
} from 'date-fns'

import { Item, Relevance, RowDefinition } from 'react-gantt'

export const generateRows = (count: number) =>
	Array(count)
		.fill(0)
		.map((_, index) => ({
			id: `row-${index}`,
		}))

export const getRandomInRange = (min: number, max: number) => {
	return Math.random() * (max - min) + min
}

const MS_IN_DAY = hoursToMilliseconds(24)
const MIN_ITEM_DURATION = minutesToMilliseconds(60)
const MAX_ITEM_DURATION = minutesToMilliseconds(360)

export const generateRandomRelevance = () => {
	const randomStart = getRandomInRange(0, MS_IN_DAY)
	const randomDuration = getRandomInRange(MIN_ITEM_DURATION, MAX_ITEM_DURATION)

	const start = addMilliseconds(startOfDay(new Date()), randomStart)
	const end = addMilliseconds(start, randomDuration)

	return {
		start,
		end,
	} as Relevance
}

export const generateItems = (count: number, rows: RowDefinition[]) =>
	Array(count)
		.fill(0)
		.map((_, index) => {
			const rowId = rows[Math.ceil(Math.random() * rows.length - 1)].id
			const disabled = !!(Math.random() < 0.2)
			const background = !!(Math.random() < 0.2)
			const relevance = generateRandomRelevance()

			let id = `item-${index}`
			if (background) id += ' (bg)'
			if (disabled) id += ' (disabled)'

			return {
				id,
				rowId,
				relevance,
				disabled,
				background,
			} as Item
		})
