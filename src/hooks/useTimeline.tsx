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

import { DragDirection } from './useItem'

import { Relevance, Timeframe } from '../types'

export type ResizeMoveEvent = {
  active: Omit<Active, 'rect'>
  delta: {
    x: number
  }
  direction: DragDirection
}

export type ResizeEndEvent = ResizeMoveEvent

export type ResizeStartEvent = {
  active: Omit<Active, 'rect'>
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

export type OnResizeStart = (event: ResizeStartEvent) => void

export type OnResizeEnd = (event: ResizeEndEvent) => void

export type OnResizeMove = (event: ResizeMoveEvent) => void

export type OnPanEnd = (deltaX: number, deltaY: number) => void

export type PixelsToMilliseconds = (pixels: number) => number
export type MillisecondsToPixels = (milliseconds: number) => number

export type TimelineBag = {
  style: CSSProperties
  timeframe: Timeframe
  overlayed: boolean
  sidebarWidth: number
  onResizeEnd: OnResizeEnd
  onResizeMove?: OnResizeMove
  onResizeStart?: OnResizeStart
  timeframeGridSize?: number
  timelineDirection: CanvasDirection
  setTimelineRef: React.RefObject<HTMLDivElement>
  setSidebarWidth: React.Dispatch<React.SetStateAction<number>>
  millisecondsToPixels: MillisecondsToPixels
  pixelsToMilliseconds: PixelsToMilliseconds
  getDateFromScreenX: GetDateFromScreenX
  getRelevanceFromDragEvent: GetRelevanceFromDragEvent
}

export type OnTimeframeChanged = (
  updateFunction: (prev: Timeframe) => Timeframe
) => void

export type GridSizeDefinition = {
  value: number
  maxTimeframeSize?: number
}

export interface UseTimelineProps {
  timeframe: Timeframe
  overlayed?: boolean
  onResizeEnd: OnResizeEnd
  onResizeMove?: OnResizeMove
  onResizeStart?: OnResizeStart
  onTimeframeChanged: OnTimeframeChanged
  timeframeGridSize?: number | GridSizeDefinition[]
}

const style: CSSProperties = {
  display: 'flex',
  overflow: 'hidden',
  position: 'relative',
  flexDirection: 'column',
}

export default function useTimeline(props: UseTimelineProps): TimelineBag {
  const {
    onTimeframeChanged,
    onResizeMove,
    onResizeStart,
    onResizeEnd: onResizeEndCallback,
  } = props

  const timelineRef = useRef<HTMLDivElement>(null)
  const dragStartTimeframe = useRef<Timeframe>(props.timeframe)

  const [timelineWidth, setTimelineWidth] = useState(0)
  const [sidebarWidth, setSidebarWidth] = useState(0)
  const [timelineDirection, setTimelineDirection] =
    useState<CanvasDirection>('ltr')

  const timelineViewportWidth = timelineWidth - sidebarWidth

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
        timelineViewportWidth /
        differenceInMilliseconds(props.timeframe.end, props.timeframe.start)
      return milliseconds * msToPixel
    },
    [timelineViewportWidth, props.timeframe]
  )

  const pixelsToMilliseconds = useCallback<PixelsToMilliseconds>(
    (pixels: number) => {
      const pixelToMs =
        differenceInMilliseconds(props.timeframe.end, props.timeframe.start) /
        timelineViewportWidth
      return pixels * pixelToMs
    },
    [props.timeframe, timelineViewportWidth]
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
      const side = timelineDirection === 'rtl' ? 'right' : 'left'

      const timelineSideX =
        (timelineRef.current?.getBoundingClientRect()[side] || 0) +
        sidebarWidth * (timelineDirection === 'rtl' ? -1 : 1)

      const deltaX = screenX - timelineSideX

      const deltaInMilliseconds =
        pixelsToMilliseconds(deltaX) * (timelineDirection === 'rtl' ? -1 : 1)

      return snapDateToTimeframeGrid(
        addMilliseconds(props.timeframe.start, deltaInMilliseconds)
      )
    },
    [
      sidebarWidth,
      timelineDirection,
      pixelsToMilliseconds,
      props.timeframe.start,
      snapDateToTimeframeGrid,
    ]
  )

  const getRelevanceFromDragEvent = useCallback<GetRelevanceFromDragEvent>(
    (event) => {
      const side = timelineDirection === 'rtl' ? 'right' : 'left'
      const itemX = event.active.rect.current.translated?.[side] || 0

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
    [getDateFromScreenX, snapDateToTimeframeGrid, timelineDirection]
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
        pixelsToMilliseconds(event.deltaX) *
        (timelineDirection === 'rtl' ? -1 : 1)
      const deltaYInMilliseconds =
        pixelsToMilliseconds(event.deltaY) *
        (timelineDirection === 'rtl' ? -1 : 1)

      const startDelta = deltaYInMilliseconds + deltaXInMilliseconds
      const endDelta = -deltaYInMilliseconds + deltaXInMilliseconds

      onTimeframeChanged((prev) => ({
        start: addMilliseconds(prev.start, startDelta),
        end: addMilliseconds(prev.end, endDelta),
      }))
    },
    [pixelsToMilliseconds, onTimeframeChanged, timelineDirection]
  )

  const onDragStart = useCallback(() => {
    dragStartTimeframe.current = props.timeframe
  }, [props.timeframe])

  useDndMonitor({
    onDragStart,
  })

  useLayoutEffect(() => {
    const element = timelineRef?.current
    if (!element) return

    const mouseWheelHandler = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return

      event.preventDefault()

      const isHorizontal = event.shiftKey

      const panEndEvent: PanEndEvent = {
        deltaX: isHorizontal ? event.deltaX || event.deltaY : 0,
        deltaY: isHorizontal ? 0 : event.deltaY,
      }

      onPanEnd(panEndEvent)
    }

    element.addEventListener('wheel', mouseWheelHandler)

    return () => {
      element?.removeEventListener('wheel', mouseWheelHandler)
    }
  }, [onPanEnd])

  useLayoutEffect(() => {
    const element = timelineRef?.current
    if (!element) return

    setTimelineDirection(getComputedStyle(element).direction as CanvasDirection)

    const observer = new ResizeObserver(() => {
      setTimelineWidth(element.clientWidth)
    })

    observer.observe(element)
    return () => {
      observer.disconnect()
    }
  }, [setTimelineWidth])

  const value = useMemo<TimelineBag>(
    () => ({
      style,
      onResizeEnd,
      onResizeMove,
      onResizeStart,
      sidebarWidth,
      setSidebarWidth,
      pixelsToMilliseconds,
      millisecondsToPixels,
      setTimelineRef: timelineRef,
      overlayed: !!props.overlayed,
      timelineDirection,
      timeframe: props.timeframe,
      timeframeGridSize,
      getDateFromScreenX,
      getRelevanceFromDragEvent,
    }),
    [
      onResizeEnd,
      onResizeMove,
      onResizeStart,
      sidebarWidth,
      setSidebarWidth,
      pixelsToMilliseconds,
      millisecondsToPixels,
      props.timeframe,
      timelineDirection,
      props.overlayed,
      timeframeGridSize,
      getDateFromScreenX,
      getRelevanceFromDragEvent,
    ]
  )

  return value
}
