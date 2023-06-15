import { CSSProperties, useLayoutEffect, useRef } from 'react'
import ResizeObserver from 'resize-observer-polyfill'
import { useDroppable } from '@dnd-kit/core'

import useGanttContext from './useGanttContext'

export type RowDefinition = {
	id: string
	disabled?: boolean
}

export type UseRowProps = RowDefinition

export default (props: UseRowProps) => {
	const sidebarRef = useRef<HTMLDivElement>(null)
	const { setSidebarWidth } = useGanttContext()

	const droppableProps = useDroppable({
		id: props.id,
		disabled: props.disabled,
	})

	useLayoutEffect(() => {
		const element = sidebarRef?.current
		if (!element) return

		const observer = new ResizeObserver(() => {
			setSidebarWidth((prev) => Math.max(element.clientWidth, prev))
		})

		observer.observe(element)
		return () => {
			observer.disconnect()
		}
	}, [])

	const rowWrapperStyle: CSSProperties = {
		display: 'inline-flex',
	}

	const rowStyle: CSSProperties = {
		flex: 1,
		display: 'flex',
		position: 'relative',
		alignItems: 'stretch',
		flexDirection: 'column',
	}

	const rowSidebarStyle: CSSProperties = {
		left: 0,
		zIndex: 3,
		display: 'flex',
	}

	return {
		rowStyle,
		rowWrapperStyle,
		rowSidebarStyle,
		setSidebarRef: sidebarRef,
		...droppableProps,
	}
}
