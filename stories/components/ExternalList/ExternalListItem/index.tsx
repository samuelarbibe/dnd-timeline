import React, { CSSProperties, ReactNode } from 'react'

import classes from './ExternalListItem.module.css'

import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'

import { ListItemDefinition } from '..'

interface ExternalListItemProps extends ListItemDefinition {
	children: ReactNode
}

export default function (props: ExternalListItemProps) {
	const {
		attributes,
		isDragging,
		listeners,
		setNodeRef,
		transform,
		transition,
	} = useSortable({
		id: props.id,
		disabled: props.disabled,
		data: { type: 'list-item', duration: props.duration },
	})

	const style: CSSProperties = {
		opacity: isDragging ? 0.4 : undefined,
		transform: CSS.Translate.toString(transform),
		transition,
	}

	return (
		<li
			className={classes['item-wrapper']}
			ref={setNodeRef}
			style={style}
			{...listeners}
			{...attributes}
			{...listeners}
		>
			{props.children}
		</li>
	)
}
