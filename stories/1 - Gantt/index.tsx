import React, { useCallback, useMemo, useState } from 'react'
import Gantt, { ItemOverlay } from '../components/Gantt'

import { Relevance, Timeframe } from 'react-gantt'

import { generateItems, generateRows } from '../utils'
import { endOfDay, startOfDay } from 'date-fns'
import {
  GanttWrapperContextValue,
  GanttWrapperProvider,
} from '../components/GanttWrapper'
import {
  Active,
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core'

const DEFAULT_TIMEFRAME: Timeframe = {
  start: startOfDay(new Date()),
  end: endOfDay(new Date()),
}

export interface GanttWrapperProps {
  rowCount: number
  itemCount: number
  timeframe?: Timeframe
  disabledItemCount?: number
  disabledRowCount?: number
  backgroundItemCount?: number
  generateDroppableMap?: boolean
}

function GanttWrapper(props: GanttWrapperProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>(
    props.timeframe || DEFAULT_TIMEFRAME
  )

  const [rows, setRows] = useState(() => [
    ...generateRows(props.rowCount),
    ...generateRows(props.disabledRowCount || 0, { disabled: true }),
  ])

  const [items, setItems] = useState(() => [
    ...generateItems(props.itemCount, timeframe, rows),
    ...generateItems(props.disabledItemCount || 0, timeframe, rows, {
      disabled: true,
    }),
    ...generateItems(props.backgroundItemCount || 0, timeframe, rows, {
      background: true,
    }),
  ])

  const [draggedItem, setDraggedItem] = useState<Active | null>(null)
  const [draggedItemTempRelevance, setDraggedItemTempRelevance] =
    useState<Relevance | null>(null)

  const droppableMap = useMemo(() => {
    if (!props.generateDroppableMap) return undefined

    return items.reduce((acc, curr) => {
      const droppableRows = rows.reduce(
        (acc, curr) => (Math.random() < 0.5 ? [...acc, curr.id] : acc),
        [] as string[]
      )
      return { ...acc, [curr.id]: droppableRows }
    }, {} as Record<string, string[]>)
  }, [items, rows, props.generateDroppableMap])

  const onDragStart = useCallback(
    (event: DragStartEvent) => setDraggedItem(event.active),
    [setDraggedItem]
  )

  const onDragCancel = useCallback(() => setDraggedItem(null), [setDraggedItem])

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const overedId = event.over?.id.toString()
      if (!overedId) return

      const activeItemId = event.active.id

      const overedType = event.over?.data?.current?.type
      const activeType = event.active?.data?.current?.type
      const getRelevanceFromDragEvent =
        event.active?.data?.current?.getRelevanceFromDragEvent

      const updatedRelevance = getRelevanceFromDragEvent(event)

      if (
        updatedRelevance &&
        overedType === 'gantt-row' &&
        activeType === 'gantt-item'
      ) {
        setItems((prev) =>
          prev.map((item) => {
            if (item.id !== activeItemId) return item

            return {
              ...item,
              rowId: overedId,
              relevance: updatedRelevance,
            }
          })
        )
      }

      setDraggedItem(null)
    },
    [setItems, setDraggedItem]
  )

  const onDragMove = useCallback(
    (event: DragMoveEvent) =>
      setDraggedItemTempRelevance(
        event.active.data.current?.getRelevanceFromDragEvent(event)
      ),
    []
  )

  const value = useMemo<GanttWrapperContextValue>(
    () => ({
      rows,
      setRows,
      items,
      setItems,
      timeframe,
      setTimeframe,
      draggedItem,
      setDraggedItem,
      droppableMap,
    }),
    [rows, items, timeframe, draggedItem, droppableMap]
  )

  return (
    <GanttWrapperProvider value={value}>
      <DndContext
        onDragEnd={onDragEnd}
        onDragMove={onDragMove}
        onDragStart={onDragStart}
        onDragCancel={onDragCancel}
      >
        <Gantt />
        <DragOverlay>
          {draggedItem && draggedItemTempRelevance && (
            <ItemOverlay relevance={draggedItemTempRelevance} />
          )}
        </DragOverlay>
      </DndContext>
    </GanttWrapperProvider>
  )
}

export default GanttWrapper
