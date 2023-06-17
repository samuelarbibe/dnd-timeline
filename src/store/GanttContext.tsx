import React, { ReactElement, createContext, useCallback } from 'react'
import { DndContext, DndContextProps, DragEndEvent } from '@dnd-kit/core'

import { Gantt } from '../hooks/useGantt'

export interface GanttContextStandalone extends DndContextProps {
	value: Gantt
	children: ReactElement
}

export const ganttContext = createContext<Gantt>({} as Gantt)

const GanttContext = (props: GanttContextStandalone) => {
	const gantt = props.value

	const onDragEnd = useCallback(
		(event: DragEndEvent) => {
			gantt.onDragEnd(event)
			props.onDragEnd?.(event)
		},
		[gantt.onDragEnd, props.onDragEnd]
	)

	const onDragStart = useCallback(
		(event: DragEndEvent) => {
			gantt.onDragStart(event)
			props.onDragStart?.(event)
		},
		[gantt.onDragStart, props.onDragStart]
	)

	return (
		<DndContext
			autoScroll={false}
			{...props}
			onDragEnd={onDragEnd}
			onDragStart={onDragStart}
		>
			<ganttContext.Provider value={gantt}>
				{props.children}
			</ganttContext.Provider>
		</DndContext>
	)
}

export default GanttContext
