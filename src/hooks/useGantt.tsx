import {
  useRef,
  useMemo,
  useState,
  useCallback,
  CSSProperties,
  useLayoutEffect,
} from 'react'
import ResizeObserver from 'resize-observer-polyfill'
import {
  Active,
  DragEndEvent,
  useDndMonitor,
  DragMoveEvent,
  DragStartEvent,
  DragCancelEvent,
} from '@dnd-kit/core'
import { addMilliseconds, differenceInMilliseconds } from 'date-fns'

import usePressedKeys from './usePressedKeys'
import { DragDirection, ItemDefinition } from './useItem'

import { Relevance, Timeframe } from '../types'

export type ResizeEndEvent = {
  active: Omit<Active, 'rect'>
  delta: {
    x: number
  }
  direction: DragDirection
}

export type PanEndEvent = {
  deltaX: number
  deltaY: number
}

export type GetRelevanceFromDragEvent = (
  event: DragStartEvent | DragEndEvent | DragCancelEvent | DragMoveEvent
) => Relevance | null

export type GetDateFromScreenX = (screenX: number) => Date

export type OnResizeEnd = (event: ResizeEndEvent) => void

export type OnPanEnd = (deltaX: number, deltaY: number) => void

export type PixelsToMilliseconds = (pixels: number) => number
export type MillisecondsToPixels = (milliseconds: number) => number

export type GanttBag = {
  style: CSSProperties
  timeframe: Timeframe
  overlayed: boolean
  sidebarWidth: number
  onResizeEnd: OnResizeEnd
  timeframeGridSize?: number
  ganttDirection: CanvasDirection
  setGanttRef: React.RefObject<HTMLDivElement>
  setSidebarWidth: React.Dispatch<React.SetStateAction<number>>
  millisecondsToPixels: MillisecondsToPixels
  pixelsToMilliseconds: PixelsToMilliseconds
  getDateFromScreenX: GetDateFromScreenX
  getRelevanceFromDragEvent: GetRelevanceFromDragEvent
}

export type OnItemsChanged = (
  itemId: string,
  updateFunction: (prev: ItemDefinition) => ItemDefinition
) => void

export type OnTimeframeChanged = (
  updateFunction: (prev: Timeframe) => Timeframe
) => void

export type GridSizeDefinition = {
  value: number
  maxTimeframeSize?: number
}

export interface UseGanttProps {
  timeframe: Timeframe
  overlayed?: boolean
  onResizeEnd: OnResizeEnd
  onTimeframeChanged: OnTimeframeChanged
  timeframeGridSize?: number | GridSizeDefinition[]
}

const style: CSSProperties = {
  display: 'flex',
  overflow: 'hidden',
  position: 'relative',
  flexDirection: 'column',
}

export default function useGantt(props: UseGanttProps): GanttBag {
  const { onTimeframeChanged, onResizeEnd: onResizeEndCallback } = props

  const ganttRef = useRef<HTMLDivElement>(null)
  const dragStartTimeframe = useRef<Timeframe>(props.timeframe)

  const [ganttWidth, setGanttWidth] = useState(0)
  const [sidebarWidth, setSidebarWidth] = useState(0)
  const [ganttDirection, setGanttDirection] = useState<CanvasDirection>('ltr')

  const pressedKeys = usePressedKeys()

  const ganttViewportWidth = ganttWidth - sidebarWidth

  const timeframeGridSize = useMemo(() => {
    if (Array.isArray(props.timeframeGridSize)) {
      const gridSizes = props.timeframeGridSize as GridSizeDefinition[]

      const timeframeSize =
        props.timeframe.end.getTime() - props.timeframe.start.getTime()

      const sortedTimeframeGridSizes = [...gridSizes]
      sortedTimeframeGridSizes.sort((a, b) => a.value - b.value)

      return sortedTimeframeGridSizes.find(
        (curr) =>
          !curr?.maxTimeframeSize || timeframeSize < curr.maxTimeframeSize
      )?.value
    }

    return props.timeframeGridSize
  }, [props.timeframe, props.timeframeGridSize])

  const millisecondsToPixels = useCallback<MillisecondsToPixels>(
    (milliseconds: number) => {
      const msToPixel =
        ganttViewportWidth /
        differenceInMilliseconds(props.timeframe.end, props.timeframe.start)
      return milliseconds * msToPixel
    },
    [ganttViewportWidth, props.timeframe]
  )

  const pixelsToMilliseconds = useCallback<PixelsToMilliseconds>(
    (pixels: number) => {
      const pixelToMs =
        differenceInMilliseconds(props.timeframe.end, props.timeframe.start) /
        ganttViewportWidth
      return pixels * pixelToMs
    },
    [props.timeframe, ganttViewportWidth]
  )

  const snapDateToTimeframeGrid = useCallback(
    (date: Date) => {
      if (!timeframeGridSize) return date

      return new Date(
        Math.round(date.getTime() / timeframeGridSize) * timeframeGridSize
      )
    },
    [timeframeGridSize]
  )

  const getDateFromScreenX = useCallback<GetDateFromScreenX>(
    (screenX) => {
      const side = ganttDirection === 'rtl' ? 'right' : 'left'

      const ganttSideX =
        (ganttRef.current?.getBoundingClientRect()[side] || 0) +
        sidebarWidth * (ganttDirection === 'rtl' ? -1 : 1)

      const deltaX = screenX - ganttSideX

      const deltaInMilliseconds =
        pixelsToMilliseconds(deltaX) * (ganttDirection === 'rtl' ? -1 : 1)

      return snapDateToTimeframeGrid(
        addMilliseconds(props.timeframe.start, deltaInMilliseconds)
      )
    },
    [
      sidebarWidth,
      ganttDirection,
      pixelsToMilliseconds,
      props.timeframe.start,
      snapDateToTimeframeGrid,
    ]
  )

  const getRelevanceFromDragEvent = useCallback<GetRelevanceFromDragEvent>(
    (event) => {
      const itemX = event.active.rect.current.translated?.left || 0

      const start = getDateFromScreenX(itemX)

      if (event.active.data.current?.relevance) {
        const { start: prevItemStart, end: prevItemEnd } =
          event.active.data.current.relevance
        const itemDurationInMs = differenceInMilliseconds(
          prevItemEnd,
          prevItemStart
        )

        const end = snapDateToTimeframeGrid(
          addMilliseconds(start, itemDurationInMs)
        )

        return { start, end }
      } else if (event.active.data.current?.duration) {
        const itemDurationInMs = event.active.data.current.duration
        const end = snapDateToTimeframeGrid(
          addMilliseconds(start, itemDurationInMs)
        )

        return { start, end }
      }

      return null
    },
    [getDateFromScreenX, snapDateToTimeframeGrid]
  )

  const onResizeEnd = useCallback(
    (event: ResizeEndEvent) => {
      if (event.active.data.current?.relevance) {
        const prevRelevance = event.active.data.current?.relevance
        const deltaInMilliseconds = pixelsToMilliseconds(event.delta.x)

        event.active.data.current.relevance[event.direction] =
          snapDateToTimeframeGrid(
            addMilliseconds(prevRelevance[event.direction], deltaInMilliseconds)
          )
      }

      onResizeEndCallback(event)
    },
    [pixelsToMilliseconds, snapDateToTimeframeGrid, onResizeEndCallback]
  )

  const onPanEnd = useCallback(
    (event: PanEndEvent) => {
      const deltaXInMilliseconds =
        pixelsToMilliseconds(event.deltaX) * (ganttDirection === 'rtl' ? -1 : 1)
      const deltaYInMilliseconds =
        pixelsToMilliseconds(event.deltaY) * (ganttDirection === 'rtl' ? -1 : 1)

      const startDelta = deltaYInMilliseconds + deltaXInMilliseconds
      const endDelta = -deltaYInMilliseconds + deltaXInMilliseconds

      onTimeframeChanged((prev) => ({
        start: addMilliseconds(prev.start, startDelta),
        end: addMilliseconds(prev.end, endDelta),
      }))
    },
    [pixelsToMilliseconds, onTimeframeChanged, ganttDirection]
  )

  const onDragStart = useCallback(() => {
    dragStartTimeframe.current = props.timeframe
  }, [props.timeframe])

  useDndMonitor({
    onDragStart,
  })

  useLayoutEffect(() => {
    const element = ganttRef?.current
    if (!element) return

    const mouseWheelHandler = (event: WheelEvent) => {
      if (!pressedKeys?.Meta) return

      event.preventDefault()
      onPanEnd(event)
    }

    element.addEventListener('wheel', mouseWheelHandler)

    return () => {
      element?.removeEventListener('wheel', mouseWheelHandler)
    }
  }, [onPanEnd, pressedKeys?.Meta])

  useLayoutEffect(() => {
    const element = ganttRef?.current
    if (!element) return

    setGanttDirection(getComputedStyle(element).direction as CanvasDirection)

    const observer = new ResizeObserver(() => {
      setGanttWidth(element.clientWidth)
    })

    observer.observe(element)
    return () => {
      observer.disconnect()
    }
  }, [setGanttWidth])

  const value = useMemo<GanttBag>(
    () => ({
      style,
      onResizeEnd,
      sidebarWidth,
      setSidebarWidth,
      pixelsToMilliseconds,
      millisecondsToPixels,
      setGanttRef: ganttRef,
      overlayed: !!props.overlayed,
      ganttDirection,
      timeframe: props.timeframe,
      timeframeGridSize,
      getDateFromScreenX,
      getRelevanceFromDragEvent,
    }),
    [
      onResizeEnd,
      sidebarWidth,
      setSidebarWidth,
      pixelsToMilliseconds,
      millisecondsToPixels,
      props.timeframe,
      ganttDirection,
      props.overlayed,
      timeframeGridSize,
      getDateFromScreenX,
      getRelevanceFromDragEvent,
    ]
  )

  return value
}
