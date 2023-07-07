import React, {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
} from 'react'
import { Active } from '@dnd-kit/core'

import { ItemDefinition, RowDefinition, Timeframe } from 'dnd-timeline'
import { ListItemDefinition } from '../ExternalList'

export type TimelineWrapperContextValue = {
  items: ItemDefinition[]
  setItems: Dispatch<SetStateAction<ItemDefinition[]>>
  listItems?: ListItemDefinition[]
  setListItems?: Dispatch<SetStateAction<ListItemDefinition[]>>
  rows: RowDefinition[]
  setRows: Dispatch<SetStateAction<RowDefinition[]>>
  timeframe: Timeframe
  setTimeframe: Dispatch<SetStateAction<Timeframe>>
  droppableMap?: Record<string, string[]>
  draggedItem: Active | null
  setDraggedItem: Dispatch<SetStateAction<Active | null>>
}

const timelineWrapperContext = createContext<TimelineWrapperContextValue>(
  {} as TimelineWrapperContextValue
)

interface TimelineWrapperProviderProps extends PropsWithChildren {
  value: TimelineWrapperContextValue
}

export const useTimelineWrapperContext = () =>
  useContext(timelineWrapperContext)

export const TimelineWrapperProvider = (
  props: TimelineWrapperProviderProps
) => {
  return (
    <timelineWrapperContext.Provider value={props.value}>
      {props.children}
    </timelineWrapperContext.Provider>
  )
}
