import {
  useRef,
  useState,
  useCallback,
  PointerEvent,
  CSSProperties,
  useLayoutEffect,
} from 'react'
import { CSS } from '@dnd-kit/utilities'
import { useDraggable } from '@dnd-kit/core'

import { Relevance } from '../types'
import useTimelineContext from './useTimelineContext'

export type DragDirection = 'start' | 'end'

export type ItemDefinition = {
  id: string
  rowId: string
  disabled?: boolean
  relevance: Relevance
  background?: boolean
}

export type UseItemProps = Pick<
  ItemDefinition,
  'id' | 'relevance' | 'disabled' | 'background'
> & {
  data?: object
}

const getDragDirection = (
  mouseX: number,
  clientRect: DOMRect,
  direction: CanvasDirection
): DragDirection | null => {
  const startSide = direction == 'rtl' ? 'right' : 'left'
  const endSide = direction == 'rtl' ? 'left' : 'right'

  if (Math.abs(mouseX - clientRect[startSide]) <= RESIZE_HANDLER_WIDTH / 2) {
    return 'start'
  } else if (
    Math.abs(mouseX - clientRect[endSide]) <=
    RESIZE_HANDLER_WIDTH / 2
  ) {
    return 'end'
  }
  return null
}

const RESIZE_HANDLER_WIDTH = 20

export default function useItem(props: UseItemProps) {
  const dataRef = useRef<object>()
  const dragStartX = useRef<number>()
  const [dragDirection, setDragDirection] = useState<DragDirection | null>()

  const {
    timeframe,
    overlayed,
    onResizeEnd,
    timelineDirection,
    millisecondsToPixels,
    getRelevanceFromDragEvent,
  } = useTimelineContext()

  dataRef.current = {
    getRelevanceFromDragEvent,
    relevance: props.relevance,
    ...(props.data || {}),
  }

  const draggableProps = useDraggable({
    id: props.id,
    data: dataRef.current,
    disabled: props.disabled,
  })

  const deltaX = millisecondsToPixels(
    props.relevance.start.getTime() - timeframe.start.getTime()
  )

  const width = millisecondsToPixels(
    props.relevance.end.getTime() - props.relevance.start.getTime()
  )

  const side = timelineDirection === 'rtl' ? 'right' : 'left'

  const cursor = props.disabled
    ? 'inherit'
    : draggableProps.isDragging
      ? 'grabbing'
      : 'grab'

  useLayoutEffect(() => {
    if (!dragDirection) return

    const mouseMoveHandler = (event: MouseEvent) => {
      if (!dragStartX.current || !draggableProps.node.current) return

      const dragDeltaX =
        (event.clientX - dragStartX.current) *
        (timelineDirection === 'rtl' ? -1 : 1)

      if (dragDirection === 'start') {
        const newSideDelta = deltaX + dragDeltaX
        draggableProps.node.current.style[side] = newSideDelta + 'px'

        const newWidth = width + deltaX - newSideDelta
        draggableProps.node.current.style.width = newWidth + 'px'
      } else {
        const otherSideDelta = deltaX + width + dragDeltaX
        const newWidth = otherSideDelta - deltaX
        draggableProps.node.current.style.width = newWidth + 'px'
      }
    }

    window.addEventListener('mousemove', mouseMoveHandler)

    return () => {
      window.removeEventListener('mousemove', mouseMoveHandler)
    }
  }, [
    width,
    deltaX,
    dragDirection,
    draggableProps.node,
    timelineDirection,
    side,
  ])

  useLayoutEffect(() => {
    if (!dragDirection) return

    const mouseUpHandler = () => {
      if (!dragStartX.current || !draggableProps.node.current) return

      let dragDelta = 0

      if (dragDirection === 'start') {
        const currentSideDelta = parseInt(
          draggableProps.node.current.style[side].slice(0, -2)
        )
        dragDelta = currentSideDelta - deltaX
      } else {
        const currentWidth = parseInt(
          draggableProps.node.current.style.width.slice(0, -2)
        )
        dragDelta = currentWidth - width
      }

      onResizeEnd({
        delta: {
          x: dragDelta,
        },
        direction: dragDirection,
        active: {
          id: props.id,
          data: dataRef,
        },
      })

      setDragDirection(null)

      draggableProps.node.current.style.width = width + 'px'
      draggableProps.node.current.style[side] = deltaX + 'px'
    }

    window.addEventListener('mouseup', mouseUpHandler)

    return () => {
      window.removeEventListener('mouseup', mouseUpHandler)
    }
  }, [
    side,
    width,
    deltaX,
    props.id,
    onResizeEnd,
    dragDirection,
    setDragDirection,
    draggableProps.node,
  ])

  const onPointerMove = useCallback(
    (event: PointerEvent) => {
      if (!draggableProps.node.current || props.disabled) return

      const newDragDirection = getDragDirection(
        event.clientX,
        draggableProps.node.current.getBoundingClientRect(),
        timelineDirection
      )

      if (newDragDirection) {
        draggableProps.node.current.style.cursor = 'col-resize'
      } else {
        draggableProps.node.current.style.cursor = cursor
      }
    },
    [draggableProps.node, props.disabled, timelineDirection, cursor]
  )

  const onPointerDown = useCallback(
    (event: PointerEvent) => {
      if (!draggableProps.node.current || props.disabled) return

      const newDragDirection = getDragDirection(
        event.clientX,
        draggableProps.node.current.getBoundingClientRect(),
        timelineDirection
      )

      if (newDragDirection) {
        setDragDirection(newDragDirection)
        dragStartX.current = event.clientX
      } else {
        draggableProps.listeners?.onPointerDown(event)
      }
    },
    [
      props.disabled,
      timelineDirection,
      draggableProps.node,
      draggableProps.listeners,
    ]
  )

  const paddingSide =
    timelineDirection === 'rtl' ? 'paddingRight' : 'paddingLeft'

  const itemStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    width,
    [side]: deltaX,
    cursor,
    height: '100%',
    zIndex: props.disabled ? 0 : props.background ? 1 : 2,
    ...(!(draggableProps.isDragging && overlayed) && {
      transform: CSS.Translate.toString(draggableProps.transform),
    }),
  }

  const itemContentStyle: CSSProperties = {
    height: '100%',
    display: 'flex',
    overflow: 'hidden',
    alignItems: 'stretch',
    [paddingSide]: Math.max(0, -parseInt(itemStyle[side]?.toString() || '0')),
  }

  return {
    itemStyle,
    itemContentStyle,
    ...draggableProps,
    listeners: {
      ...draggableProps.listeners,
      onPointerDown,
      onPointerMove,
    },
  }
}
