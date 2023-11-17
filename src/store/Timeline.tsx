import React, { PropsWithChildren, createContext } from 'react'
import { DndContext, DndContextProps } from '@dnd-kit/core'

import useTimeline, {
  UseTimelineProps,
  TimelineBag,
} from '../hooks/useTimeline'

export interface TimelineContextProps
  extends PropsWithChildren,
    UseTimelineProps,
    DndContextProps {}

export const timelineContext = createContext<TimelineBag>({} as TimelineBag)

export const TimelineProvider = timelineContext.Provider

const TimelineProviderInner = (props: TimelineContextProps) => {
  const timeline = useTimeline(props)

  return <TimelineProvider value={timeline}>{props.children}</TimelineProvider>
}

export const TimelineContext = (props: TimelineContextProps) => {
  return (
    <DndContext {...props}>
      <TimelineProviderInner {...props}>{props.children}</TimelineProviderInner>
    </DndContext>
  )
}
