import { CSSProperties } from 'react'
import { CSS } from '@dnd-kit/utilities'
import { useDraggable } from '@dnd-kit/core'

import { Relevance } from '../types'
import useGanttContext from './useGanttContext'

export type Item = {
	id: string
	rowId: string
	relevance: Relevance
	disabled?: boolean
	overlay?: boolean
	background?: boolean
}

export type UseItemProps = Pick<
	Item,
	'id' | 'relevance' | 'disabled' | 'overlay'
>

export default (props: UseItemProps) => {
	const draggableProps = useDraggable({
		id: props.id,
		disabled: props.disabled,
		data: {
			relevance: props.relevance,
		},
	})
	const { timeframe, millisecondsToPixels, direction } = useGanttContext()

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
		zIndex: 1,
		height: '100%',
		...(!props.overlay && {
			transform: CSS.Translate.toString(draggableProps.transform),
		}),
	}

	const itemContentStyle: CSSProperties = {
		height: '100%',
		display: 'flex',
		position: 'relative',
		[paddingSide]: Math.max(0, -parseInt(itemStyle[side]?.toString() || '0')),
	}

	return {
		itemStyle,
		itemContentStyle,
		...draggableProps,
	}
}
