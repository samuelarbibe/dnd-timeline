import React, { useMemo, memo, useRef, useLayoutEffect } from 'react'
import defaultClasses from './TimeCursor.module.css'

import { useGanttContext } from 'react-gantt'

type TimeCursorClasses = Partial<Record<'time-cursor', string>>

interface TimeCursorProps {
  interval?: number
  classes?: TimeCursorClasses
}

function TimeCursor(props: TimeCursorProps) {
  const timeCursorRef = useRef<HTMLDivElement>(null)

  const { timeframe, ganttDirection, sidebarWidth, millisecondsToPixels } =
    useGanttContext()

  const side = ganttDirection === 'rtl' ? 'right' : 'left'

  const classes = useMemo(
    () => ({ ...defaultClasses, ...props.classes }),
    [props.classes]
  )

  useLayoutEffect(() => {
    const offsetCursor = () => {
      if (!timeCursorRef.current) return
      const timeDelta = new Date().getTime() - timeframe.start.getTime()
      const timeDeltaInPixels = millisecondsToPixels(timeDelta)

      const sideDelta = sidebarWidth + timeDeltaInPixels
      timeCursorRef.current.style[side] = sideDelta + 'px'
    }

    offsetCursor()

    const interval = setInterval(offsetCursor, props.interval || 1000)

    return () => {
      clearInterval(interval)
    }
  }, [
    side,
    sidebarWidth,
    props.interval,
    timeframe.start,
    millisecondsToPixels,
  ])

  return <div ref={timeCursorRef} className={classes['time-cursor']} />
}

export default memo(TimeCursor)
