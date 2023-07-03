import classNames from 'classnames'
import React, { useMemo } from 'react'

import {
  format,
  setDefaultOptions,
  hoursToMilliseconds,
  minutesToMilliseconds,
} from 'date-fns'
import { he } from 'date-fns/locale'

setDefaultOptions({ locale: he })

import {
  Relevance,
  RowDefinition,
  ItemDefinition,
  useGanttContext,
  groupItemsToRows,
  groupItemsToSubrows,
} from 'react-gantt'

import classes from './Gantt.module.css'

import Row from '../Row'
import Item from '../Item'

import TimeCursor from '../TimeCursor'
import TimeAxis, { MarkerDefinition } from '../TimeAxis'
// import { Active, useDndMonitor } from '@dnd-kit/core'

const ItemIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
    />
  </svg>
)

export function ItemOverlay({ relevance }: { relevance: Relevance }) {
  return (
    <div className={classNames(classes.item, classes['item-overlay'])}>
      {ItemIcon}
      <span>
        {format(relevance.start, 'HH:mm')} - {format(relevance.end, 'HH:mm')}
      </span>
    </div>
  )
}

interface GanttProps {
  items: ItemDefinition[]
  rows: RowDefinition[]
}

function Gantt({ items, rows }: GanttProps) {
  const gantt = useGanttContext()

  // const [, setDraggedItem] = useState<Active | null>(null)

  // useDndMonitor({
  //   onDragStart: (event) => setDraggedItem(event.active),
  //   onDragEnd: () => setDraggedItem(null),
  //   onDragCancel: () => setDraggedItem(null),
  // })

  const groupedBackgroundItems = useMemo(
    () =>
      groupItemsToRows(
        items.filter((item) => item.background),
        gantt.timeframe
      ),
    [items, gantt.timeframe]
  )

  const groupedSubrows = useMemo(
    () => groupItemsToSubrows(items, gantt.timeframe),
    [items, gantt.timeframe]
  )

  const timeAxisMarkers = useMemo<MarkerDefinition[]>(
    () => [
      {
        value: hoursToMilliseconds(24),
        getLabel: (date: Date) => format(date, 'eo'),
      },
      {
        value: hoursToMilliseconds(2),
        minTimeframeSize: hoursToMilliseconds(24),
        getLabel: (date: Date) => format(date, 'k'),
      },
      {
        value: hoursToMilliseconds(1),
        minTimeframeSize: hoursToMilliseconds(24),
      },
      {
        value: hoursToMilliseconds(1),
        maxTimeframeSize: hoursToMilliseconds(24),
        getLabel: (date: Date) => format(date, 'k'),
      },
      {
        value: minutesToMilliseconds(30),
        maxTimeframeSize: hoursToMilliseconds(24),
        minTimeframeSize: hoursToMilliseconds(12),
      },
      {
        value: minutesToMilliseconds(15),
        maxTimeframeSize: hoursToMilliseconds(12),
        getLabel: (date: Date) => format(date, 'm'),
      },
      {
        value: minutesToMilliseconds(5),
        maxTimeframeSize: hoursToMilliseconds(6),
        minTimeframeSize: hoursToMilliseconds(3),
      },
      {
        value: minutesToMilliseconds(5),
        maxTimeframeSize: hoursToMilliseconds(3),
        getLabel: (date: Date) => format(date, 'm'),
      },
      {
        value: minutesToMilliseconds(1),
        maxTimeframeSize: hoursToMilliseconds(2),
      },
    ],
    []
  )

  return (
    <div ref={gantt.setGanttRef} style={gantt.style} className={classes.gantt}>
      <TimeCursor />
      <TimeAxis markers={timeAxisMarkers} />
      {rows.map((row) => (
        <Row
          id={row.id}
          key={row.id}
          classes={classes}
          disabled={row.disabled}
          sidebar={
            <div className={classes['row-sidebar']}>
              {row.id.replace('-', ' ')}
            </div>
          }
        >
          {groupedBackgroundItems[row.id]?.map((item) => (
            <Item
              classes={classes}
              id={item.id}
              key={item.id}
              rowId={row.id}
              disabled={item.disabled}
              relevance={item.relevance}
              background={item.background}
            >
              <div
                className={classNames(classes.item, classes['item-background'])}
              >
                {ItemIcon}
                <span>
                  {item.disabled ? 'Disabled Item' : 'Background Item'}
                </span>
              </div>
            </Item>
          ))}
          {groupedSubrows[row.id]?.map((subrow, index) => (
            <div key={index} className={classes.subrow}>
              {subrow.map((item) => (
                <Item
                  classes={classes}
                  id={item.id}
                  key={item.id}
                  rowId={row.id}
                  disabled={item.disabled}
                  relevance={item.relevance}
                  background={item.background}
                >
                  <div
                    className={classNames(
                      classes.item,
                      item.background && classes['item-background']
                    )}
                  >
                    {ItemIcon}
                    <span>
                      {item.disabled ? 'Disabled Item' : 'Draggable Item'}
                    </span>
                  </div>
                </Item>
              ))}
            </div>
          ))}
        </Row>
      ))}
    </div>
  )
}

export default Gantt
