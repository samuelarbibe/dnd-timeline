import { useContext } from 'react'
import { ganttContext } from '../store/Gantt'

export default function useGanttContext() {
  const contextValue = useContext(ganttContext)

  if (contextValue === undefined) {
    throw new Error(
      'react-gantt: useGanttContext() must be used within a GanttContext'
    )
  }

  return contextValue
}
