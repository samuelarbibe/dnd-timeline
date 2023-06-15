import React, {
	CSSProperties,
	ReactElement,
	cloneElement,
	createContext,
	useCallback,
} from 'react'
import { DndContext, DndContextProps, DragEndEvent } from '@dnd-kit/core'

import { Gantt } from '../hooks/useGantt'

export interface GanttContextStandalone extends DndContextProps {
	value: Gantt
	children: ReactElement
}

export const ganttContext = createContext<Gantt>({} as Gantt)

const GanttContext = (props: GanttContextStandalone) => {
	const gantt = props.value

	const updatedChildren = cloneElement(props.children as ReactElement, {
		style: {
			...props.children.props.style,
			direction: gantt.direction,
		} as CSSProperties,
	})

	const onDragEnd = useCallback(
		(event: DragEndEvent) => {
			gantt.onDragEnd(event)
			props.onDragEnd?.(event)
		},
		[gantt.onDragEnd, props.onDragEnd]
	)

	return (
		<DndContext autoScroll={false} {...props} onDragEnd={onDragEnd}>
			<ganttContext.Provider value={gantt}>
				{updatedChildren}
			</ganttContext.Provider>
		</DndContext>
	)
}

export default GanttContext
