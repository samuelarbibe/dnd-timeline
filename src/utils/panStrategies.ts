import { useLayoutEffect } from 'react'
import { OnPanEnd, PanEndEvent } from '../hooks/useTimeline'

export type UsePanStrategy = (
  timelineRef: React.MutableRefObject<HTMLElement | null>,
  onPanEnd: OnPanEnd
) => void

export const useWheelStrategy: UsePanStrategy = (timelineRef, onPanEnd) => {
  useLayoutEffect(() => {
    const element = timelineRef?.current
    if (!element) return

    const mouseWheelHandler = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return

      event.preventDefault()

      const isHorizontal = event.shiftKey

      const panEndEvent: PanEndEvent = {
        clientX: event.clientX,
        clientY: event.clientY,
        deltaX: isHorizontal ? event.deltaX || event.deltaY : 0,
        deltaY: isHorizontal ? 0 : event.deltaY,
      }

      onPanEnd(panEndEvent)
    }

    element.addEventListener('wheel', mouseWheelHandler)

    return () => {
      element?.removeEventListener('wheel', mouseWheelHandler)
    }
  }, [onPanEnd, timelineRef])
}
