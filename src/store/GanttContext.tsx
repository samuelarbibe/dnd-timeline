import React, {
	CSSProperties,
	ReactElement,
	cloneElement,
	createContext,
} from 'react'
import { DndContext, DndContextProps } from '@dnd-kit/core'

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

	return (
		<DndContext autoScroll={false} onDragEnd={gantt.handleOnDragEnd} {...props}>
			<ganttContext.Provider value={gantt}>
				{updatedChildren}
			</ganttContext.Provider>
		</DndContext>
	)
}

export default GanttContext
