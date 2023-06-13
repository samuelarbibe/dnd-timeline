import classes from './Subrow.module.css'

import React, { ReactNode } from 'react'

interface SubrowProps {
	children: ReactNode
}

export function Subrow(props: SubrowProps) {
	return <div className={classes['subrow']}>{props.children}</div>
}
