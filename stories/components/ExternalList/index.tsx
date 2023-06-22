import React, { CSSProperties } from 'react'
import classNames from 'classnames'
import { SortableContext } from '@dnd-kit/sortable'

import { ItemDefinition } from 'react-gantt'

import classes from './ExternalList.module.css'

import ExternalListItem from './ExternalListItem'
import { useGanttWrapperContext } from '../GanttWrapper'

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

export type ListItemDefinition = Omit<ItemDefinition, 'rowId' | 'relevance'> & {
	duration: number
}

export function ListItemOverlay() {
	return (
		<div className={classNames(classes.item, classes['item-overlay'])}>
			{ItemIcon}
			<span>Drop Me inside the Gantt!</span>
		</div>
	)
}

export default function () {
	const { listItems = [] } = useGanttWrapperContext()

	return (
		<SortableContext items={listItems}>
			<ul className={classes['list']}>
				{listItems.map((item) => (
					<ExternalListItem
						id={item.id}
						key={item.id}
						disabled={item.disabled}
						duration={item.duration}
					>
						<div className={classes.item}>
							{ItemIcon}
							<span>{item.disabled ? 'Disabled Item' : 'List Item'}</span>
						</div>
					</ExternalListItem>
				))}
			</ul>
		</SortableContext>
	)
}
