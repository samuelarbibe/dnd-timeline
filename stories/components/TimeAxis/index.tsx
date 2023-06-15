import React, { useMemo } from 'react'
import defaultClasses from './TimeAxis.module.css'

import { useGanttContext } from 'react-gantt'
import { getHours, hoursToMilliseconds } from 'date-fns'

const DEFAULT_TIMEFRAME_GRIDSIZE = hoursToMilliseconds(1)

type Marker = {
	label?: string
	sideDelta: number
	multiplier: number
	heightMultiplier: number
}

type TimeAxisClasses = Partial<
	Record<'time-axis' | 'marker-container' | 'marker' | 'marker-label', string>
>

interface TimeAxisProps {
	classes?: TimeAxisClasses
}

export default function (props: TimeAxisProps) {
	const {
		timeframe,
		direction,
		sidebarWidth,
		millisecondsToPixels,
		timeframeGridSize = DEFAULT_TIMEFRAME_GRIDSIZE,
	} = useGanttContext()

	const side = direction === 'rtl' ? 'right' : 'left'

	const classes = useMemo(
		() => ({ ...defaultClasses, ...props.classes }),
		[props.classes]
	)

	const markers = useMemo(() => {
		const startTime =
			Math.floor(timeframe.start.getTime() / timeframeGridSize) *
			timeframeGridSize

		const endTime = timeframe.end.getTime()

		const multipliers = [1, 0.5, 0.25]

		const markerSideDeltas: Marker[] = []

		for (
			let time = startTime;
			time <= endTime;
			time += hoursToMilliseconds(multipliers[multipliers.length - 1])
		) {
			const multiplier = multipliers.find(
				(divider) => time % hoursToMilliseconds(divider) === 0
			) as number

			markerSideDeltas.push({
				...(multiplier === multipliers[0] && {
					label: getHours(new Date(time)).toString(),
				}),
				sideDelta: millisecondsToPixels(time - timeframe.start.getTime()),
				multiplier,
				heightMultiplier: multiplier,
			})
		}

		return markerSideDeltas
	}, [timeframe, timeframeGridSize, millisecondsToPixels])

	return (
		<div
			className={classes['time-axis']}
			style={{
				[side === 'right' ? 'marginRight' : 'marginLeft']: sidebarWidth + 'px',
			}}
		>
			{markers.map((marker, index) => (
				<div
					key={index}
					className={classes['marker-container']}
					style={{
						[side]: marker.sideDelta + 'px',
					}}
				>
					<div
						className={classes['marker']}
						style={{ height: 100 * marker.heightMultiplier + '%' }}
					/>
					{marker.label && (
						<div className={classes['marker-label']}>{marker.label}</div>
					)}
				</div>
			))}
		</div>
	)
}
