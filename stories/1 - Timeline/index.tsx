import React, { useCallback, useMemo, useState } from 'react'

import {
  Relevance,
  Timeframe,
  ResizeEndEvent,
  GridSizeDefinition,
  Timeline as TimelineContext,
} from 'dnd-timeline'

import {
  endOfDay,
  startOfDay,
  hoursToMilliseconds,
  minutesToMilliseconds,
} from 'date-fns'
import {
  Active,
  DragOverlay,
  DragEndEvent,
  DragMoveEvent,
  DragStartEvent,
} from '@dnd-kit/core'

import { generateItems, generateRows } from '../utils'

import Timeline, { ItemOverlay } from '../components/Timeline'

const DEFAULT_TIMEFRAME: Timeframe = {
  start: startOfDay(new Date()),
  end: endOfDay(new Date()),
}

export interface TimelineWrapperProps {
  rowCount: number
  itemCount: number
  timeframe?: Timeframe
  disabledItemCount?: number
  disabledRowCount?: number
  backgroundItemCount?: number
  generateDroppableMap?: boolean
}

function TimelineWrapper(props: TimelineWrapperProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>(
    props.timeframe || DEFAULT_TIMEFRAME
  )

  const [rows] = useState(() => [
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
        overedType === 'timeline-row' &&
        activeType === 'timeline-item'
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
        event.active.data.current?.getRelevanceFromDragEvent?.(event)
      ),
    []
  )

  const onResizeEnd = useCallback(
    (event: ResizeEndEvent) => {
      const updatedRelevance =
        event.active.data.current?.getRelevanceFromResizeEvent?.(event)

      if (!updatedRelevance) return

      const activeItemId = event.active.id

      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== activeItemId) return item

          return {
            ...item,
            relevance: updatedRelevance,
          }
        })
      )
    },
    [setItems]
  )

  const timeframeGridSize = useMemo<GridSizeDefinition[]>(
    () => [
      {
        value: hoursToMilliseconds(1),
      },
      {
        value: minutesToMilliseconds(30),
        maxTimeframeSize: hoursToMilliseconds(24),
      },
      {
        value: minutesToMilliseconds(15),
        maxTimeframeSize: hoursToMilliseconds(12),
      },
      {
        value: minutesToMilliseconds(5),
        maxTimeframeSize: hoursToMilliseconds(6),
      },
      {
        value: minutesToMilliseconds(1),
        maxTimeframeSize: hoursToMilliseconds(2),
      },
    ],
    []
  )

  return (
    <TimelineContext
      onDragEnd={onDragEnd}
      onDragMove={onDragMove}
      onResizeEnd={onResizeEnd}
      onDragStart={onDragStart}
      onDragCancel={onDragCancel}
      timeframe={timeframe}
      onTimeframeChanged={setTimeframe}
      timeframeGridSize={timeframeGridSize}
    >
      <Timeline rows={rows} items={items} />
      <DragOverlay>
        {draggedItem && draggedItemTempRelevance && (
          <ItemOverlay relevance={draggedItemTempRelevance} />
        )}
      </DragOverlay>
    </TimelineContext>
  )
}

export default TimelineWrapper
