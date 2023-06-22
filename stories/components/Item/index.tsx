import React, { ReactNode, useMemo } from 'react'
import defaultClasses from './Item.module.css'

import { ItemDefinition, useItem } from 'react-gantt'
import classNames from 'classnames'

type ItemClasses = Partial<
	Record<'item-wrapper' | 'item-content-wrapper' | 'item-dragging', string>
>

interface ItemProps extends ItemDefinition {
	children: ReactNode
	classes?: ItemClasses
}

export default function (props: ItemProps) {
	const {
		setNodeRef,
		attributes,
		listeners,
		isDragging,
		itemStyle,
		itemContentStyle,
	} = useItem({
		id: props.id,
		disabled: props.disabled,
		relevance: props.relevance,
		background: props.background,
		data: {
			type: 'gantt-item',
			relevance: props.relevance,
		},
	})

	const classes = useMemo(
		() => ({ ...defaultClasses, ...props.classes }),
		[props.classes]
	)

	return (
		<div
			className={classNames(
				classes['item-wrapper'],
				isDragging && classes['item-dragging']
			)}
			ref={setNodeRef}
			style={itemStyle}
			{...listeners}
			{...attributes}
		>
			<div style={itemContentStyle} className={classes['item-content-wrapper']}>
				{props.children}
			</div>
		</div>
	)
}
