import React, { useCallback, useMemo, useState } from 'react'
import { addMilliseconds, endOfDay, startOfDay } from 'date-fns'

import { generateItems, generateRows } from '../utils'

import { Item, Row, Subrow } from 'components'

import {
	OnItemsChanged,
	Timeframe,
	Item as ItemType,
	useGantt,
	groupItemsToSubrows,
	groupItemsToRows,
	GanttContext,
	validateItems,
} from 'react-gantt'

const DEFAULT_TIMEFRAME: Timeframe = {
	start: startOfDay(new Date()),
	end: endOfDay(new Date()),
}

const rows = generateRows(10)
const initialItems = generateItems(10, rows)

export default () => {
	const [items, setItems] = useState(initialItems)
	const [timeframe] = useState<Timeframe>(DEFAULT_TIMEFRAME)

	const onItemChanged = useCallback<OnItemsChanged>((itemId, delta) => {
		setItems((prev) =>
			prev.map((item) => {
				if (item.id !== itemId) return item

				const updatedItem: ItemType = {
					...item,
					...(delta.rowId && { rowId: delta.rowId }),
					...(delta.relevance && {
						relevance: {
							start: addMilliseconds(
								item.relevance.start,
								delta.relevance.start || 0
							),
							end: addMilliseconds(
								item.relevance.end,
								delta.relevance.end || 0
							),
						},
					}),
				}

				const isValid = validateItems(updatedItem)

				return isValid ? updatedItem : item
			})
		)
	}, [])

	const gantt = useGantt({ timeframe, onItemChanged, direction: 'ltr' })

	const subrows = useMemo(
		() => groupItemsToSubrows(items, timeframe),
		[items, timeframe]
	)

	const backgroundItems = useMemo(
		() =>
			groupItemsToRows(
				items.filter((item) => item.background),
				timeframe
			),
		[items, timeframe]
	)

	return (
		<div className="container">
			<GanttContext value={gantt}>
				<div ref={gantt.setGanttRef} style={gantt.style}>
					{rows.map((row) => (
						<Row id={row.id} key={row.id}>
							{backgroundItems[row.id]?.map((item) => (
								<Item
									id={item.id}
									key={item.id}
									rowId={row.id}
									disabled={item.disabled}
									relevance={item.relevance}
								>
									<div className="background-item">{item.id}</div>
								</Item>
							))}
							{subrows[row.id]?.map((items, index) => (
								<Subrow key={index}>
									{items.map((item) => (
										<Item
											id={item.id}
											key={item.id}
											rowId={row.id}
											disabled={item.disabled}
											relevance={item.relevance}
										>
											<div className="item">{item.id}</div>
										</Item>
									))}
								</Subrow>
							))}
						</Row>
					))}
				</div>
			</GanttContext>
		</div>
	)
}
