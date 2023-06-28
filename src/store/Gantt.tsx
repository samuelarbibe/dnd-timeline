import React, { PropsWithChildren, createContext } from 'react'
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

  return (
    <DndContext {...props}>
      <GanttProvider value={gantt}>{props.children}</GanttProvider>
    </DndContext>
  )
}
