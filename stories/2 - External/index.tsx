import React, { useCallback, useMemo, useState } from 'react'
import {
  Active,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'

import classes from './External.module.css'

import Timeline, { ItemOverlay } from '../components/Timeline'
import ExternalList, { ListItemOverlay } from '../components/ExternalList'
import { generateItems, generateListItems, generateRows } from '../utils'

import {
  endOfDay,
  hoursToMilliseconds,
  minutesToMilliseconds,
  startOfDay,
} from 'date-fns'
import {
  Relevance,
  Timeframe,
  ResizeEndEvent,
  ItemDefinition,
  GridSizeDefinition,
  Timeline as TimelineContext,
} from 'dnd-timeline'

const DEFAULT_TIMEFRAME: Timeframe = {
  start: startOfDay(new Date()),
  end: endOfDay(new Date()),
}

export interface ExternalWrapperProps {
  rowCount: number
  itemCount: number
  listItemCount: number
  timeframe?: Timeframe
  disabledItemCount?: number
  disabledRowCount?: number
  backgroundItemCount?: number
  generateDroppableMap?: boolean
}

function ExternalListWrapper(props: ExternalWrapperProps) {
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

  const [listItems, setListItems] = useState(() => [
    ...generateListItems(props.listItemCount),
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
      } else if (
        activeItemId !== overedId &&
        overedType === 'list-item' &&
        activeType === 'list-item'
      ) {
        setListItems((prev) => {
          const activeIndex = prev.findIndex(({ id }) => id === activeItemId)
          const overIndex = prev.findIndex(({ id }) => id === overedId)
          return arrayMove(prev, activeIndex, overIndex)
        })
      } else if (
        updatedRelevance &&
        overedType === 'timeline-row' &&
        activeType === 'list-item'
      ) {
        setListItems((prev) =>
          prev.filter((listItem) => listItem.id !== activeItemId)
        )
        setItems((prev) => {
          const newItem: ItemDefinition = {
            id: activeItemId.toString(),
            rowId: overedId.toString(),
            relevance: updatedRelevance,
          }

          return [...prev, newItem]
        })
      }

      setDraggedItem(null)
    },
    [setItems, setListItems, setDraggedItem]
  )

  const onDragMove = useCallback(
    (event: DragMoveEvent) =>
      setDraggedItemTempRelevance(
        event.active.data.current?.getRelevanceFromDragEvent(event)
      ),
    []
  )

  const onResizeEnd = useCallback(
    (event: ResizeEndEvent) => {
      const updatedRelevance = event.active.data.current?.relevance
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
    <div className={classes.container}>
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
        <ExternalList listItems={listItems} />
        <Timeline rows={rows} items={items} />
        <DragOverlay
          {...(draggedItem?.data?.current?.width && {
            style: { width: draggedItem?.data?.current?.width + 'px' },
          })}
        >
          {draggedItem?.data?.current?.type === 'timeline-item' &&
            draggedItemTempRelevance && (
            <ItemOverlay relevance={draggedItemTempRelevance} />
          )}
          {draggedItem?.data?.current?.type === 'list-item' &&
            draggedItemTempRelevance && (
            <ListItemOverlay relevance={draggedItemTempRelevance} />
          )}
        </DragOverlay>
      </TimelineContext>
    </div>
  )
}

export default ExternalListWrapper
