import React, { PropsWithChildren, createContext, useMemo } from 'react'
import { DndContext, DndContextProps } from '@dnd-kit/core'

import useGantt, { UseGanttProps, GanttBag } from '../hooks/useGantt'

export interface GanttContextStandalone
	extends PropsWithChildren,
		UseGanttProps,
		Omit<DndContextProps, 'onDragStart' | 'onDragEnd'> {}

export const ganttContext = createContext<GanttBag>({} as GanttBag)

export const GanttProvider = ganttContext.Provider

export const Gantt = (props: GanttContextStandalone) => {
	const gantt = useGantt(props)

	const dndContextProps = useMemo(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { onDragEnd, onDragStart, ...rest } = props
		return rest
	}, [props])

	return (
		<DndContext {...dndContextProps}>
			<GanttProvider value={gantt}>{props.children}</GanttProvider>
		</DndContext>
	)
}
