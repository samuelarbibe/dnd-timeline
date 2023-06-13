import {
	startOfDay,
	addMilliseconds,
	hoursToMilliseconds,
	minutesToMilliseconds,
} from 'date-fns'

import { ItemDefinition, Relevance, RowDefinition } from 'react-gantt'

export const generateRows = (count: number) =>
	Array(count)
		.fill(0)
		.map(
			(_, index) =>
				({
					id: `row-${index}`,
				} as RowDefinition)
		)

export const getRandomInRange = (min: number, max: number) => {
	return Math.random() * (max - min) + min
}

const MS_IN_DAY = hoursToMilliseconds(24)
const MIN_ITEM_DURATION = minutesToMilliseconds(120)
const MAX_ITEM_DURATION = minutesToMilliseconds(360)

export const generateRandomRelevance = (min: number, max: number) => {
	const randomStart = getRandomInRange(0, MS_IN_DAY)
	const randomDuration = getRandomInRange(min, max)

	const start = addMilliseconds(startOfDay(new Date()), randomStart)
	const end = addMilliseconds(start, randomDuration)

	return {
		start,
		end,
	} as Relevance
}

type GenerateItemsOptions = {
	disabledRatio: number
	backgroundRatio: number
	length: {
		min: number
		max: number
	}
}

const defaultGenerateItemsOptions: GenerateItemsOptions = {
	backgroundRatio: 0,
	disabledRatio: 0,
	length: {
		min: MIN_ITEM_DURATION,
		max: MAX_ITEM_DURATION,
	},
}

export const generateItems = (
	count: number,
	rows: RowDefinition[],
	options?: Partial<GenerateItemsOptions>
) =>
	Array(count)
		.fill(0)
		.map((_, index) => {
			const mergedOptions = { ...defaultGenerateItemsOptions, ...options }
			const rowId = rows[Math.ceil(Math.random() * rows.length - 1)].id
			const disabled = !!(Math.random() < (mergedOptions.disabledRatio || 0))
			const background = !!(
				Math.random() < (mergedOptions.backgroundRatio || 0)
			)
			const relevance = generateRandomRelevance(
				mergedOptions.length.min,
				mergedOptions.length.max
			)

			let id = `item-${index}`
			if (background) id += ' (bg)'
			if (disabled) id += ' (disabled)'

			return {
				id,
				rowId,
				relevance,
				disabled,
				background,
			} as ItemDefinition
		})
