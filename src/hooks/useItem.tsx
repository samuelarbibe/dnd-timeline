import { CSSProperties } from 'react'
import { CSS } from '@dnd-kit/utilities'
import { useDraggable } from '@dnd-kit/core'

import { Relevance } from '../types'
import useGanttContext from './useGanttContext'

export type ItemDefinition = {
	id: string
	rowId: string
	disabled?: boolean
	relevance: Relevance
	background?: boolean
}

export type UseItemProps = Pick<
	ItemDefinition,
	'id' | 'relevance' | 'disabled' | 'background'
>

export default (props: UseItemProps) => {
	const draggableProps = useDraggable({
		id: props.id,
		disabled: props.disabled,
		data: {
			relevance: props.relevance,
		},
	})
	const { timeframe, millisecondsToPixels, direction, overlayed } =
		useGanttContext()

	const side = direction === 'rtl' ? 'right' : 'left'
	const paddingSide = direction === 'rtl' ? 'paddingRight' : 'paddingLeft'

	const deltaX = millisecondsToPixels(
		props.relevance.start.getTime() - timeframe.start.getTime()
	)
	const width = millisecondsToPixels(
		props.relevance.end.getTime() - props.relevance.start.getTime()
	)

	const cursor = props.disabled
		? 'inherit'
		: draggableProps.isDragging
			? 'grabbing'
			: 'grab'

	const itemStyle: CSSProperties = {
		position: 'absolute',
		top: 0,
		width,
		[side]: deltaX,
		cursor,
		height: '100%',
		zIndex: props.background ? 1 : 2,
		...(!(draggableProps.isDragging && overlayed) && {
			transform: CSS.Translate.toString(draggableProps.transform),
		}),
	}

	const itemContentStyle: CSSProperties = {
		height: '100%',
		display: 'flex',
		overflow: 'hidden',
		alignItems: 'stretch',
		[paddingSide]: Math.max(0, -parseInt(itemStyle[side]?.toString() || '0')),
	}

	return {
		itemStyle,
		itemContentStyle,
		...draggableProps,
	}
}
