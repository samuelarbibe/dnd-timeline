import React, { useMemo, memo } from 'react'
import defaultClasses from './TimeAxis.module.css'

import { useGanttContext } from 'react-gantt'
import { minutesToMilliseconds } from 'date-fns'

type Marker = {
	label?: string
	sideDelta: number
	heightMultiplier: number
}

type TimeAxisClasses = Partial<
	Record<'time-axis' | 'marker-container' | 'marker' | 'marker-label', string>
>

export type MarkerDefinition = {
	value: number
	maxTimeframeSize?: number
	minTimeframeSize?: number
	getLabel?: (time: Date) => string
}

interface TimeAxisProps {
	markers: MarkerDefinition[]
	classes?: TimeAxisClasses
}

export default memo(function (props: TimeAxisProps) {
	const { timeframe, ganttDirection, sidebarWidth, millisecondsToPixels } =
		useGanttContext()

	const side = ganttDirection === 'rtl' ? 'right' : 'left'

	const classes = useMemo(
		() => ({ ...defaultClasses, ...props.classes }),
		[props.classes]
	)

	const markers = useMemo(() => {
		const sortedMarkers = [...props.markers]
		sortedMarkers.sort((a, b) => b.value - a.value)

		const delta = sortedMarkers[sortedMarkers.length - 1].value

		const timeframeSize = timeframe.end.getTime() - timeframe.start.getTime()

		const startTime = Math.floor(timeframe.start.getTime() / delta) * delta

		const endTime = timeframe.end.getTime()
		const timezoneOffset = minutesToMilliseconds(new Date().getTimezoneOffset())

		const markerSideDeltas: Marker[] = []

		for (let time = startTime; time <= endTime; time += delta) {
			const multiplierIndex = sortedMarkers.findIndex(
				(marker) =>
					(time - timezoneOffset) % marker.value === 0 &&
					(!marker.maxTimeframeSize ||
						timeframeSize <= marker.maxTimeframeSize) &&
					(!marker.minTimeframeSize || timeframeSize >= marker.minTimeframeSize)
			)

			if (multiplierIndex === -1) continue

			const multiplier = sortedMarkers[multiplierIndex]

			const label = multiplier.getLabel?.(new Date(time))

			markerSideDeltas.push({
				label,
				heightMultiplier: 1 / (multiplierIndex + 1),
				sideDelta: millisecondsToPixels(time - timeframe.start.getTime()),
			})
		}

		return markerSideDeltas
	}, [timeframe, millisecondsToPixels, props.markers])

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
						style={{
							height: 100 * marker.heightMultiplier + '%',
						}}
					/>
					{marker.label && (
						<div
							className={classes['marker-label']}
							style={{
								fontWeight: marker.heightMultiplier * 1000,
							}}
						>
							{marker.label}
						</div>
					)}
				</div>
			))}
		</div>
	)
})
