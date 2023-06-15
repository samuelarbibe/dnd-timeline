import {
	startOfDay,
	addMilliseconds,
	hoursToMilliseconds,
	minutesToMilliseconds,
} from 'date-fns'
import { nanoid } from 'nanoid'
import { ItemDefinition, Relevance, RowDefinition } from 'react-gantt'

type GenerateRowsOptions = {
	disabledRatio: number
}

const defaultGenerateRowsOptions: GenerateRowsOptions = {
	disabledRatio: 0,
}

export const generateRows = (
	count: number,
	options?: Partial<GenerateRowsOptions>
) => {
	const mergedOptions = { ...defaultGenerateRowsOptions, ...options }

	return Array(count)
		.fill(0)
		.map((): RowDefinition => {
			const disabled = !!(Math.random() < (mergedOptions.disabledRatio || 0))

			let id = `row-${nanoid(4)}`
			if (disabled) id += ' (disabled)'

			return {
				id,
				disabled,
			}
		})
}

export const getRandomInRange = (min: number, max: number) => {
	return Math.random() * (max - min) + min
}

const MS_IN_DAY = hoursToMilliseconds(24)
const MIN_ITEM_DURATION = minutesToMilliseconds(120)
const MAX_ITEM_DURATION = minutesToMilliseconds(360)

export const generateRandomRelevance = (
	min: number,
	max: number
): Relevance => {
	const randomStart = getRandomInRange(0, MS_IN_DAY)
	const randomDuration = getRandomInRange(min, max)

	const start = addMilliseconds(startOfDay(new Date()), randomStart)
	const end = addMilliseconds(start, randomDuration)

	return {
		start,
		end,
	}
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
) => {
	const mergedOptions = { ...defaultGenerateItemsOptions, ...options }

	return Array(count)
		.fill(0)
		.map((): ItemDefinition => {
			const row = rows[Math.ceil(Math.random() * rows.length - 1)]
			const rowId = row.id
			const disabled =
				row.disabled || !!(Math.random() < mergedOptions.disabledRatio)
			const background = !!(Math.random() < mergedOptions.backgroundRatio)

			const relevance = generateRandomRelevance(
				mergedOptions.length.min,
				mergedOptions.length.max
			)

			let id = `item-${nanoid(4)}`
			if (background) id += ' (bg)'
			if (disabled) id += ' (disabled)'

			return {
				id,
				rowId,
				relevance,
				disabled,
				background,
			}
		})
}
