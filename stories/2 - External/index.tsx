import React, { useCallback, useMemo, useState } from 'react'
import {
  Active,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'

import classes from './External.module.css'

import Gantt, { ItemOverlay } from '../components/Gantt'
import ExternalList, { ListItemOverlay } from '../components/ExternalList'
import {
  GanttWrapperContextValue,
  GanttWrapperProvider,
} from '../components/GanttWrapper'
import { generateItems, generateListItems, generateRows } from '../utils'

import { endOfDay, startOfDay } from 'date-fns'
import { ItemDefinition, Timeframe } from 'react-gantt'

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

  const [listItems, setListItems] = useState(() => [
    ...generateListItems(props.listItemCount),
  ])

  const [draggedItem, setDraggedItem] = useState<Active | null>(null)

  const droppableMap = useMemo(
    () =>
      props.generateDroppableMap
        ? items.reduce((acc, curr) => {
          const droppableRows = rows.reduce(
            (acc, curr) => (Math.random() < 0.5 ? [...acc, curr.id] : acc),
              [] as string[]
          )
          return { ...acc, [curr.id]: droppableRows }
        }, {} as Record<string, string[]>)
        : undefined,
    [items, rows, props.generateDroppableMap]
  )

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

      const updatedRelevance = event.active.data.current?.relevance

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
        overedType === 'gantt-row' &&
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

  const value = useMemo<GanttWrapperContextValue>(
    () => ({
      rows,
      setRows,
      items,
      setItems,
      listItems,
      setListItems,
      timeframe,
      setTimeframe,
      draggedItem,
      setDraggedItem,
      droppableMap,
      onDragEnd,
    }),
    [rows, items, listItems, timeframe, draggedItem, droppableMap, onDragEnd]
  )

  return (
    <div className={classes.container}>
      <GanttWrapperProvider value={value}>
        <DndContext onDragStart={onDragStart} onDragCancel={onDragCancel}>
          <ExternalList />
          <Gantt />
          <DragOverlay
            {...(draggedItem?.data?.current?.width && {
              style: { width: draggedItem?.data?.current?.width + 'px' },
            })}
          >
            {draggedItem?.data?.current?.type === 'gantt-item' && (
              <ItemOverlay />
            )}
            {draggedItem?.data?.current?.type === 'list-item' && (
              <ListItemOverlay />
            )}
          </DragOverlay>
        </DndContext>
      </GanttWrapperProvider>
    </div>
  )
}

export default ExternalListWrapper
