import '../index.css'
import classNames from 'classnames'
import React, { useState, useCallback, useMemo } from 'react'
import { addMilliseconds, endOfDay, startOfDay } from 'date-fns'

import { Meta, StoryObj } from '@storybook/react'
import {
	OnItemsChanged,
	Timeframe,
	useGantt,
	groupItemsToRows,
	GanttContext,
	validateItems,
	RowDefinition,
	ItemDefinition,
} from 'react-gantt'
import { DragOverlay, DragStartEvent } from '@dnd-kit/core'

import classes from './Item.module.css'

import Row from '../components/Row'
import Item from '../components/Item'

import { generateItems, generateRows } from '../utils'

const DEFAULT_TIMEFRAME: Timeframe = {
	start: startOfDay(new Date()),
	end: endOfDay(new Date()),
}

const ItemIcon = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke="currentColor"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
		/>
	</svg>
)

interface GanttProps {
	items: ItemDefinition[]
	rows: RowDefinition[]
}

function Gantt(props: GanttProps) {
	const [rows] = useState(props.rows)
	const [items, setItems] = useState(props.items)
	const [timeframe] = useState<Timeframe>(DEFAULT_TIMEFRAME)
	const [draggedItemId, setDraggedItemId] = useState<string | null>(null)

	const onItemChanged = useCallback<OnItemsChanged>(
		(itemId, delta) => {
			setItems((prev) =>
				prev.map((item) => {
					if (item.id !== itemId) return item

					const updatedItem: ItemDefinition = {
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
			setDraggedItemId(null)
		},
		[setItems, setDraggedItemId]
	)

	const gantt = useGantt({
		timeframe,
		onItemChanged,
		overlayed: true,
	})

	const groupedItems = useMemo(
		() => groupItemsToRows(items, timeframe),
		[items, timeframe]
	)

	const handleOnDragStart = useCallback(
		(event: DragStartEvent) => setDraggedItemId(event.active.id.toString()),
		[setDraggedItemId]
	)

	const handleOnDragCancel = useCallback(
		() => setDraggedItemId(null),
		[setDraggedItemId]
	)

	return (
		<GanttContext
			value={gantt}
			onDragStart={handleOnDragStart}
			onDragCancel={handleOnDragCancel}
		>
			<div ref={gantt.setGanttRef} style={gantt.style} className="gantt">
				{rows.map((row) => (
					<Row
						id={row.id}
						key={row.id}
						classes={classes}
						sidebar={
							<div className={classes['row-sidebar']}>
								{row.id.replace('-', ' ')}
							</div>
						}
					>
						{groupedItems[row.id]?.map((item) => (
							<Item
								classes={classes}
								id={item.id}
								key={item.id}
								rowId={row.id}
								disabled={item.disabled}
								relevance={item.relevance}
								background={item.background}
							>
								<div
									className={classNames(
										classes.item,
										item.background && classes['item-background']
									)}
								>
									{ItemIcon}
									<span>
										{item.disabled
											? 'Disabled Item'
											: item.background
												? 'Background Item'
												: 'Draggable Item'}
									</span>
								</div>
							</Item>
						))}
					</Row>
				))}
				<DragOverlay>
					{draggedItemId && (
						<div className={classNames(classes.item, classes['item-overlay'])}>
							{ItemIcon}
							<span>Drop Me!</span>
						</div>
					)}
				</DragOverlay>
			</div>
		</GanttContext>
	)
}

const meta: Meta<typeof Gantt> = {
	title: 'Item',
	component: Gantt,
}

export default meta

type Story = StoryObj<typeof Gantt>

export const SingleItem: Story = {
	render: () => {
		const rows = generateRows(1)
		const items = generateItems(1, rows)
		return <Gantt rows={rows} items={items} />
	},
}

export const MultipleItems: Story = {
	render: () => {
		const rows = generateRows(1)
		const items = generateItems(2, rows)
		return <Gantt rows={rows} items={items} />
	},
}

export const BackgroundItem: Story = {
	render: () => {
		const rows = generateRows(1)
		const items = generateItems(3, rows, { backgroundRatio: 0.5 })

		return <Gantt rows={rows} items={items} />
	},
}

export const DisabledItem: Story = {
	render: () => {
		const rows = generateRows(1)
		const items = generateItems(1, rows, { disabledRatio: 1 })

		return <Gantt rows={rows} items={items} />
	},
}
