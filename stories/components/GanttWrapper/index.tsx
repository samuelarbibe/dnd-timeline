import React, {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
} from 'react'
import { Active } from '@dnd-kit/core'

import { ItemDefinition, RowDefinition, Timeframe } from 'react-gantt'
import { ListItemDefinition } from '../ExternalList'

export type GanttWrapperContextValue = {
  items: ItemDefinition[]
  unstyled?: boolean
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

const ganttWrapperContext = createContext<GanttWrapperContextValue>(
  {} as GanttWrapperContextValue
)

interface GanttWrapperProviderProps extends PropsWithChildren {
  value: GanttWrapperContextValue
}

export const useGanttWrapperContext = () => useContext(ganttWrapperContext)

export const GanttWrapperProvider = (props: GanttWrapperProviderProps) => {
  return (
    <ganttWrapperContext.Provider value={props.value}>
      {props.children}
    </ganttWrapperContext.Provider>
  )
}
