import { useContext } from 'react'
import { ganttContext } from '../store/GanttContext'

export default () => {
	const contextValue = useContext(ganttContext)

	if (contextValue === undefined) {
		throw new Error(
			'react-gantt: useGanttContext() must be used withing a GanttContext'
		)
	}

	return contextValue
}
