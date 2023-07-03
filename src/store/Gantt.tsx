import React, { PropsWithChildren, createContext } from 'react'
import { DndContext, DndContextProps } from '@dnd-kit/core'

import useGantt, { UseGanttProps, GanttBag } from '../hooks/useGantt'

export interface GanttContextStandalone
  extends PropsWithChildren,
    UseGanttProps,
    DndContextProps {}

export const ganttContext = createContext<GanttBag>({} as GanttBag)

export const GanttProvider = ganttContext.Provider

const GanttProviderInner = (props: GanttContextStandalone) => {
  const gantt = useGantt(props)

  return <GanttProvider value={gantt}>{props.children}</GanttProvider>
}

export const Gantt = (props: GanttContextStandalone) => {
  return (
    <DndContext {...props}>
      <GanttProviderInner {...props}>{props.children}</GanttProviderInner>
    </DndContext>
  )
}
