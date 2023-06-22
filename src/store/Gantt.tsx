import React, { PropsWithChildren, createContext, useMemo } from 'react'
import { DndContext, DndContextProps } from '@dnd-kit/core'

import useGantt, {
	UseGanttProps,
	GanttBag as GanttType,
} from '../hooks/useGantt'

export interface GanttContextStandalone
	extends PropsWithChildren,
		UseGanttProps,
		Omit<DndContextProps, 'onDragEnd'> {}

export const ganttContext = createContext<GanttType>({} as GanttType)

export const GanttProvider = ganttContext.Provider

export const Gantt = (props: GanttContextStandalone) => {
	const gantt = useGantt(props)

	const dndContextProps = useMemo(() => {
		const { onDragEnd, ...rest } = props
		return rest
	}, [props])

	return (
		<DndContext {...dndContextProps}>
			<GanttProvider value={gantt}>{props.children}</GanttProvider>
		</DndContext>
	)
}
