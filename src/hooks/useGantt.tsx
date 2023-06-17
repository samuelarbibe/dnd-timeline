import {
	CSSProperties,
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import { addMilliseconds, differenceInMilliseconds } from 'date-fns'
import ResizeObserver from 'resize-observer-polyfill'
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core'

import { Timeframe } from '../types'
import { DragDirection, ItemDefinition } from './useItem'
import usePressedKeys from './usePressedKeys'

export type OnDragEnd = (event: DragEndEvent) => void
export type OnDragStart = (event: DragStartEvent) => void

export type OnResizeEnd = (
	itemId: string,
	deltaX: number,
	side: DragDirection
) => void

export type OnPanEnd = (deltaX: number, deltaY: number) => void

export type Gantt = {
	style: CSSProperties
	timeframe: Timeframe
	overlayed: boolean
	sidebarWidth: number
	onDragEnd: OnDragEnd
	onDragStart: OnDragStart
	onResizeEnd: OnResizeEnd
	timeframeGridSize?: number
	ganttDirection: CanvasDirection
	setGanttRef: React.RefObject<HTMLDivElement>
	setSidebarWidth: React.Dispatch<React.SetStateAction<number>>
	millisecondsToPixels: MillisecondsToPixels
	pixelsToMilliseconds: PixelsToMilliseconds
}

export type MillisecondsToPixels = (milliseconds: number) => number
export type PixelsToMilliseconds = (pixels: number) => number

export type OnItemsChanged = (
	itemId: string,
	updateFunction: (prev: ItemDefinition) => ItemDefinition
) => void

export type OnTimeframeChanged = (
	updateFunction: (prev: Timeframe) => Timeframe
) => void

export type GridSizeDefinition = {
	value: number
	maxTimeframeSize?: number
}

export interface UseGanttProps {
	timeframe: Timeframe
	timeframeGridSize?: number | GridSizeDefinition[]
	onTimeframeChanged: OnTimeframeChanged
	onItemChanged: OnItemsChanged
	overlayed?: boolean
}

const style: CSSProperties = {
	display: 'flex',
	overflow: 'hidden',
	position: 'relative',
	flexDirection: 'column',
}

export default (props: UseGanttProps): Gantt => {
	const ganttRef = useRef<HTMLDivElement>(null)
	const dragStartTimeframe = useRef<Timeframe>(props.timeframe)

	const [ganttWidth, setGanttWidth] = useState(0)
	const [sidebarWidth, setSidebarWidth] = useState(0)
	const [ganttDirection, setGanttDirection] = useState<CanvasDirection>('ltr')

	const pressedKeys = usePressedKeys()

	const timeframeGridSize = useMemo(() => {
		if (Array.isArray(props.timeframeGridSize)) {
			const gridSizes = props.timeframeGridSize as GridSizeDefinition[]

			const timeframeSize =
				props.timeframe.end.getTime() - props.timeframe.start.getTime()

			const sortedTimeframeGridSizes = [...gridSizes]
			sortedTimeframeGridSizes.sort((a, b) => a.value - b.value)

			return sortedTimeframeGridSizes.find(
				(curr) =>
					!curr?.maxTimeframeSize || timeframeSize < curr.maxTimeframeSize
			)?.value
		}

		return props.timeframeGridSize
	}, [props.timeframe, props.timeframeGridSize])

	useLayoutEffect(() => {
		const element = ganttRef?.current
		if (!element) return

		setGanttDirection(getComputedStyle(element).direction as CanvasDirection)

		const observer = new ResizeObserver(() => {
			setGanttWidth(element.clientWidth)
		})

		observer.observe(element)
		return () => {
			observer.disconnect()
		}
	}, [setGanttWidth])

	const ganttViewportWidth = ganttWidth - sidebarWidth

	const millisecondsToPixels = useCallback<MillisecondsToPixels>(
		(milliseconds: number) => {
			const msToPixel =
				ganttViewportWidth /
				differenceInMilliseconds(props.timeframe.end, props.timeframe.start)
			return milliseconds * msToPixel
		},
		[props.timeframe, ganttViewportWidth]
	)

	const pixelsToMilliseconds = useCallback<PixelsToMilliseconds>(
		(pixels: number) => {
			const pixelToMs =
				differenceInMilliseconds(props.timeframe.end, props.timeframe.start) /
				ganttViewportWidth
			return pixels * pixelToMs
		},
		[props.timeframe, ganttViewportWidth]
	)

	const snapDateToTimeframeGrid = useCallback(
		(date: Date) => {
			if (!timeframeGridSize) return date

			return new Date(
				Math.round(date.getTime() / timeframeGridSize) * timeframeGridSize
			)
		},
		[timeframeGridSize]
	)

	const onDragStart = useCallback(() => {
		dragStartTimeframe.current = props.timeframe
	}, [props.timeframe])

	const onDragEnd = useCallback<OnDragEnd>(
		(event) => {
			const overedRow = event.over?.id.toString()
			if (!overedRow) return

			const timeframeDelta =
				dragStartTimeframe.current.start.getTime() -
				props.timeframe.start.getTime()

			const deltaX = event.delta.x
			const deltaInMilliseconds =
				(pixelsToMilliseconds(deltaX) + timeframeDelta) *
				(ganttDirection === 'rtl' ? -1 : 1)

			const activeItemId = event.active.id.toString()

			props.onItemChanged(activeItemId, (prev) => ({
				...prev,
				rowId: overedRow,
				relevance: {
					...prev.relevance,
					start: snapDateToTimeframeGrid(
						addMilliseconds(prev.relevance.start, deltaInMilliseconds)
					),
					end: snapDateToTimeframeGrid(
						addMilliseconds(prev.relevance.end, deltaInMilliseconds)
					),
				},
			}))
		},
		[
			pixelsToMilliseconds,
			snapDateToTimeframeGrid,
			props.onItemChanged,
			props.timeframe,
			ganttDirection,
		]
	)

	const onResizeEnd = useCallback<OnResizeEnd>(
		(itemId: string, deltaX: number, side: 'start' | 'end') => {
			const deltaInMilliseconds = pixelsToMilliseconds(deltaX)

			props.onItemChanged(itemId, (prev) => ({
				...prev,
				relevance: {
					...prev.relevance,
					[side]: snapDateToTimeframeGrid(
						addMilliseconds(prev.relevance[side], deltaInMilliseconds)
					),
				},
			}))
		},
		[pixelsToMilliseconds, snapDateToTimeframeGrid, props.onItemChanged]
	)

	const onPanEnd = useCallback<OnPanEnd>(
		(deltaX: number, deltaY: number) => {
			if (!pressedKeys?.Meta) return

			const deltaXInMilliseconds =
				pixelsToMilliseconds(deltaX) * (ganttDirection === 'rtl' ? -1 : 1)
			const deltaYInMilliseconds =
				pixelsToMilliseconds(deltaY) * (ganttDirection === 'rtl' ? -1 : 1)

			const startDelta = deltaYInMilliseconds + deltaXInMilliseconds
			const endDelta = -deltaYInMilliseconds + deltaXInMilliseconds

			props.onTimeframeChanged((prev) => ({
				start: addMilliseconds(prev.start, startDelta),
				end: addMilliseconds(prev.end, endDelta),
			}))
		},
		[
			pixelsToMilliseconds,
			props.onTimeframeChanged,
			ganttDirection,
			pressedKeys,
		]
	)

	useEffect(() => {
		if (!ganttRef.current) return

		const mouseDownHandler = (event: WheelEvent) => {
			event.preventDefault()
			onPanEnd(event.deltaX, event.deltaY)
		}

		ganttRef.current.addEventListener('wheel', mouseDownHandler)

		return () => {
			ganttRef.current?.removeEventListener('wheel', mouseDownHandler)
		}
	}, [onPanEnd])

	const value = useMemo<Gantt>(
		() => ({
			style,
			onDragEnd,
			onDragStart,
			onResizeEnd,
			sidebarWidth,
			setSidebarWidth,
			pixelsToMilliseconds,
			millisecondsToPixels,
			setGanttRef: ganttRef,
			overlayed: !!props.overlayed,
			ganttDirection,
			timeframe: props.timeframe,
			timeframeGridSize,
		}),
		[
			style,
			onDragEnd,
			onDragStart,
			onResizeEnd,
			sidebarWidth,
			setSidebarWidth,
			pixelsToMilliseconds,
			millisecondsToPixels,
			props.timeframe,
			ganttDirection,
			props.overlayed,
			timeframeGridSize,
		]
	)

	return value
}
