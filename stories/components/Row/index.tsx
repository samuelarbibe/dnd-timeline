import defaultClasses from './Row.module.css'

import React, { ReactNode, useMemo } from 'react'
import classNames from 'classnames'
import { useRow } from 'react-gantt'

type RowClasses = Partial<
	Record<'row' | 'row-content-wrapper' | 'row-content-overed', string>
>

interface RowProps {
	id: string
	children: ReactNode
	sidebar: ReactNode
	classes?: RowClasses
}

export default function (props: RowProps) {
	const classes = useMemo(
		() => ({ ...defaultClasses, ...props.classes }),
		[props.classes]
	)

	const {
		setNodeRef,
		setSidebarRef,
		isOver,
		rowWrapperStyle,
		rowStyle,
		rowSidebarStyle,
	} = useRow({ id: props.id })

	return (
		<div style={rowWrapperStyle} className={classes['row']}>
			<div ref={setSidebarRef} style={rowSidebarStyle}>
				{props.sidebar}
			</div>
			<div
				ref={setNodeRef}
				style={rowStyle}
				className={classNames(
					classes['row-content-wrapper'],
					isOver && classes['row-content-overed']
				)}
			>
				{props.children}
			</div>
		</div>
	)
}
