import '../index.css'
import classNames from 'classnames'
import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { endOfDay, minutesToMilliseconds, startOfDay } from 'date-fns'

import { Meta, StoryObj } from '@storybook/react'
import {
	OnItemsChanged,
	Timeframe,
	useGantt,
	GanttContext,
	RowDefinition,
	ItemDefinition,
	groupItemsToSubrows,
	groupItemsToRows,
	OnTimeframeChanged,
} from 'react-gantt'
import { DragOverlay, DragStartEvent } from '@dnd-kit/core'

import classes from './Row.module.css'

import Row from '../components/Row'
import Item from '../components/Item'

import { generateItems, generateRows } from '../utils'
import TimeAxis from '../components/TimeAxis'

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
	droppableMap?: Record<string, string[]>
}

function Gantt(props: GanttProps) {
	const [rows, setRows] = useState(props.rows)
	const [items, setItems] = useState(props.items)
	const [timeframe, setTimeframe] = useState<Timeframe>(DEFAULT_TIMEFRAME)
	const [draggedItemId, setDraggedItemId] = useState<string | null>(null)

	useEffect(() => {
		setRows(props.rows)
		setItems(props.items)
	}, [props.rows, props.items])

	const onItemChanged = useCallback<OnItemsChanged>(
		(itemId, updateFunction) => {
			setItems((prev) =>
				prev.map((item) => {
					if (item.id !== itemId) return item

					return updateFunction(item)
				})
			)
			setDraggedItemId(null)
		},
		[setItems, setDraggedItemId]
	)

	const onTimeframeChanged = useCallback<OnTimeframeChanged>(
		(updateFunction) => setTimeframe(updateFunction),
		[setTimeframe]
	)

	const gantt = useGantt({
		timeframe,
		onItemChanged,
		overlayed: true,
		onTimeframeChanged,
		timeframeGridSize: minutesToMilliseconds(60),
	})

	const groupedBackgroundItems = useMemo(
		() =>
			groupItemsToRows(
				items.filter((item) => item.background),
				timeframe
			),
		[items, timeframe]
	)

	const groupedSubrows = useMemo(
		() => groupItemsToSubrows(items, timeframe),
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

	const disabledRows = useMemo(
		(): Record<string, boolean> =>
			draggedItemId && props.droppableMap
				? props.droppableMap[draggedItemId].reduce(
					(acc, curr) => ({ ...acc, [curr]: true }),
						{} as Record<string, boolean>
				  )
				: {},
		[draggedItemId, props.droppableMap]
	)

	return (
		<GanttContext
			value={gantt}
			onDragEnd={handleOnDragCancel}
			onDragStart={handleOnDragStart}
			onDragCancel={handleOnDragCancel}
		>
			<div ref={gantt.setGanttRef} style={gantt.style} className="gantt">
				<TimeAxis />
				{rows.map((row) => (
					<Row
						id={row.id}
						key={row.id}
						classes={classes}
						disabled={row.disabled || disabledRows[row.id]}
						sidebar={
							<div className={classes['row-sidebar']}>
								{row.id.replace('-', ' ')}
							</div>
						}
					>
						{groupedBackgroundItems[row.id]?.map((item) => (
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
										classes['item-background']
									)}
								>
									{ItemIcon}
									<span>
										{item.disabled ? 'Disabled Item' : 'Background Item'}
									</span>
								</div>
							</Item>
						))}
						{groupedSubrows[row.id]?.map((subrow, index) => (
							<div key={index} className={classes.subrow}>
								{subrow.map((item) => (
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
												{item.disabled ? 'Disabled Item' : 'Draggable Item'}
											</span>
										</div>
									</Item>
								))}
							</div>
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

interface GantWrapperProps {
	rowCount: number
	itemCount: number
	disabledItemCount?: number
	disabledRowCount?: number
	backgroundItemCount?: number
	generateDroppableMap?: boolean
}

function GanttWrapper(props: GantWrapperProps) {
	const rows = generateRows(props.rowCount).concat(
		...generateRows(props.disabledRowCount || 0, { disabledRatio: 1 })
	)
	const items = generateItems(props.itemCount, rows)
		.concat(
			...generateItems(props.backgroundItemCount || 0, rows, {
				backgroundRatio: 1,
			})
		)
		.concat(
			...generateItems(props.disabledItemCount || 0, rows, { disabledRatio: 1 })
		)

	const droppableMap = props.generateDroppableMap
		? items.reduce((acc, curr) => {
			const droppableRows = rows.reduce(
				(acc, curr) => (Math.random() < 0.5 ? [...acc, curr.id] : acc),
					[] as string[]
			)
			return { ...acc, [curr.id]: droppableRows }
		  }, {} as Record<string, string[]>)
		: undefined

	return <Gantt rows={rows} items={items} droppableMap={droppableMap} />
}

const meta: Meta<typeof GanttWrapper> = {
	title: 'Row',
	tags: ['autodocs'],
	argTypes: {
		itemCount: { description: 'Number of items to generate', defaultValue: 1 },
		backgroundItemCount: {
			description: 'Number of background items to generate',
			defaultValue: 1,
			type: 'number',
		},
		disabledItemCount: {
			description: 'Number of disabled items to generate',
			defaultValue: 1,
			type: 'number',
		},
		rowCount: { description: 'Number of rows to generate', defaultValue: 1 },
		disabledRowCount: {
			description: 'Number of disabled rows to generate',
			defaultValue: 1,
			type: 'number',
		},
		generateDroppableMap: {
			description: 'Generate a droppable map?',
			defaultValue: false,
			type: 'boolean',
		},
	},
	component: GanttWrapper,
}

export default meta

type Story = StoryObj<typeof GanttWrapper>

export const MultipleRows: Story = {
	args: {
		itemCount: 1,
		rowCount: 2,
	},
}

export const MultipleRowsStacked: Story = {
	args: {
		itemCount: 2,
		rowCount: 2,
	},
}

export const MultipleRowsStackedWithBackgroundItems: Story = {
	args: {
		rowCount: 2,
		backgroundItemCount: 2,
	},
}

export const DisabledRows: Story = {
	args: {
		rowCount: 3,
		disabledRowCount: 2,
		itemCount: 4,
	},
}

export const DisabledRowsForItems: Story = {
	args: {
		rowCount: 5,
		itemCount: 4,
		generateDroppableMap: true,
	},
}
