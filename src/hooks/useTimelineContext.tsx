import { useContext } from 'react'
import { timelineContext } from '../store/Timeline'

export default function useTimelineContext() {
  const contextValue = useContext(timelineContext)

  if (contextValue === undefined) {
    throw new Error(
      'dnd-timeline: useTimelineContext() must be used within a TimelineContext'
    )
  }

  return contextValue
}
