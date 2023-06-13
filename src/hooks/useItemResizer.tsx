import { CSSProperties } from 'react'

import { useDraggable } from '@dnd-kit/core'
import { CSS, Transform } from '@dnd-kit/utilities'

export interface UseItemResizerProps {
	itemId: string
	rowId: string
	disabled?: boolean
	background?: boolean
	side: 'start' | 'end'
}

export default (props: UseItemResizerProps) => {
	const id = `${props.itemId}-resizer-${props.side}`
	const draggableProps = useDraggable({
		id,
		disabled: props.disabled,
		data: {
			type: 'resizer',
			side: props.side,
			rowId: props.rowId,
			itemId: props.itemId,
		},
	})

	const modifiedTransform: Transform = {
		x: draggableProps.transform?.x || 0,
		scaleX: draggableProps.transform?.scaleX || 0,
		y: 0,
		scaleY: 1,
	}

	const side = props.side === 'start' ? 'left' : 'right'

	const style: CSSProperties = {
		position: 'absolute',
		[side]: 0,
		top: 0,
		height: '100%',
		minWidth: '5px',
		zIndex: props.background ? 1 : 2,
		cursor: props.disabled ? 'inherit' : 'col-resize',
		transform: CSS.Translate.toString(modifiedTransform),
	}

	return {
		style,
		...draggableProps,
	}
}
