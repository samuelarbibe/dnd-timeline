import { CSSProperties, useCallback, useEffect, useRef, useState } from 'react'
import { CSS } from '@dnd-kit/utilities'
import { useDraggable } from '@dnd-kit/core'

import { Relevance } from '../types'
import useGanttContext from './useGanttContext'

const getDragDirection = (
	mouseX: number,
	clientRect: DOMRect
): DragDirection | null => {
	if (Math.abs(mouseX - clientRect.left) <= RESIZE_HANDLER_WIDTH / 2) {
		return 'start'
	} else if (Math.abs(mouseX - clientRect.right) <= RESIZE_HANDLER_WIDTH / 2) {
		return 'end'
	}
	return null
}

const RESIZE_HANDLER_WIDTH = 20

export type DragDirection = 'start' | 'end'

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
	const dragStartX = useRef<number>()
	const [dragDirection, setDragDirection] = useState<DragDirection | null>()

	const draggableProps = useDraggable({
		id: props.id,
		disabled: props.disabled,
		data: {
			relevance: props.relevance,
		},
	})

	const { timeframe, millisecondsToPixels, direction, overlayed, onResizeEnd } =
		useGanttContext()

	const deltaX = millisecondsToPixels(
		props.relevance.start.getTime() - timeframe.start.getTime()
	)

	const width = millisecondsToPixels(
		props.relevance.end.getTime() - props.relevance.start.getTime()
	)

	const side = direction === 'rtl' ? 'right' : 'left'

	const cursor = props.disabled
		? 'inherit'
		: draggableProps.isDragging
			? 'grabbing'
			: 'grab'

	useEffect(() => {
		if (!dragDirection) return

		const mouseMoveHandler = (event: MouseEvent) => {
			if (!dragStartX.current || !draggableProps.node.current) return

			const dragDelta = event.clientX - dragStartX.current
			const newWidth =
				width +
				(dragDirection === 'end'
					? dragDelta
					: dragDirection === 'start'
						? -dragDelta
						: 0)

			const newDeltaX = deltaX + (dragDirection === 'start' ? dragDelta : 0)

			draggableProps.node.current.style.width = newWidth + 'px'
			draggableProps.node.current.style[side] = newDeltaX + 'px'
		}

		window.addEventListener('mousemove', mouseMoveHandler)

		return () => {
			window.removeEventListener('mousemove', mouseMoveHandler)
		}
	}, [width, deltaX, dragDirection, draggableProps.node.current])

	useEffect(() => {
		if (!dragDirection) return

		const mouseUpHandler = (event: MouseEvent) => {
			if (!dragStartX.current || !draggableProps.node.current) return

			const dragDelta = event.clientX - dragStartX.current

			onResizeEnd(props.id, dragDelta, dragDirection)
			setDragDirection(null)

			draggableProps.node.current.style.width = width + 'px'
			draggableProps.node.current.style[side] = deltaX + 'px'
		}

		window.addEventListener('mouseup', mouseUpHandler)

		return () => {
			window.removeEventListener('mouseup', mouseUpHandler)
		}
	}, [
		width,
		deltaX,
		props.id,
		dragDirection,
		setDragDirection,
		draggableProps.node.current,
	])

	const onPointerMove = useCallback(
		(event: MouseEvent) => {
			if (!draggableProps.node.current) return

			const direction = getDragDirection(
				event.clientX,
				draggableProps.node.current.getBoundingClientRect()
			)

			if (direction) {
				draggableProps.node.current.style.cursor = 'col-resize'
			} else {
				draggableProps.node.current.style.cursor = cursor
			}
		},
		[cursor, draggableProps.node.current]
	)

	const onPointerDown = useCallback(
		(event: MouseEvent) => {
			if (!draggableProps.node.current) return

			const direction = getDragDirection(
				event.clientX,
				draggableProps.node.current.getBoundingClientRect()
			)

			if (direction) {
				setDragDirection(direction)
				dragStartX.current = event.clientX
			} else {
				draggableProps.listeners?.onPointerDown(event)
			}
		},
		[setDragDirection, draggableProps.node.current]
	)

	const paddingSide = direction === 'rtl' ? 'paddingRight' : 'paddingLeft'

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
		listeners: {
			...draggableProps.listeners,
			onPointerDown,
			onPointerMove,
		},
	}
}
