import defaultClasses from './Row.module.css'

import React, { ReactNode, useMemo } from 'react'
import classNames from 'classnames'
import { RowDefinition, useRow } from 'react-gantt'

type RowClasses = Partial<
	Record<
		'row' | 'row-content-wrapper' | 'row-content-outline' | 'row-disabled',
		string
	>
>

interface RowProps extends RowDefinition {
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
	} = useRow({ id: props.id, disabled: props.disabled })

	return (
		<div
			style={rowWrapperStyle}
			className={classNames(
				classes['row'],
				props.disabled && classes['row-disabled']
			)}
		>
			<div ref={setSidebarRef} style={rowSidebarStyle}>
				{props.sidebar}
			</div>
			<div
				ref={setNodeRef}
				style={rowStyle}
				className={classNames(classes['row-content-wrapper'])}
			>
				{isOver && <div className={classes['row-content-outline']} />}
				{props.children}
			</div>
		</div>
	)
}
