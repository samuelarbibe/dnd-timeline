import {
	CSSProperties,
	useCallback,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import ResizeObserver from 'resize-observer-polyfill'
import {
	Active,
	DragEndEvent,
	DragStartEvent,
	useDndMonitor,
} from '@dnd-kit/core'
import { addMilliseconds, differenceInMilliseconds } from 'date-fns'

import { DragDirection, ItemDefinition } from './useItem'
import usePressedKeys from './usePressedKeys'

import { Timeframe } from '../types'

export type ResizeEndEvent = {
	active: Omit<Active, 'rect'>
	delta: {
		x: number
	}
	direction: DragDirection
}

export type GetRelevanceFromDragEvent = (event: DragEndEvent) => void

export type OnDragEnd = (event: DragEndEvent) => void
export type OnDragStart = (event: DragStartEvent) => void
export type OnResizeEnd = (event: ResizeEndEvent) => void

export type OnPanEnd = (deltaX: number, deltaY: number) => void

export type GanttBag = {
	style: CSSProperties
	timeframe: Timeframe
	overlayed: boolean
	sidebarWidth: number
	onResizeEnd: OnResizeEnd
	timeframeGridSize?: number
	ganttDirection: CanvasDirection
	setGanttRef: React.RefObject<HTMLDivElement>
	setSidebarWidth: React.Dispatch<React.SetStateAction<number>>
	millisecondsToPixels: MillisecondsToPixels
	pixelsToMilliseconds: PixelsToMilliseconds
}

export type PixelsToMilliseconds = (pixels: number) => number
export type MillisecondsToPixels = (milliseconds: number) => number

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
	overlayed?: boolean
	onDragEnd: OnDragEnd
	onResizeEnd: OnResizeEnd
	onDragStart?: OnDragStart
	onTimeframeChanged: OnTimeframeChanged
	timeframeGridSize?: number | GridSizeDefinition[]
}

const style: CSSProperties = {
	display: 'flex',
	overflow: 'hidden',
	position: 'relative',
	flexDirection: 'column',
}

export default (props: UseGanttProps): GanttBag => {
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

	const onDragEnd = useCallback(
		(event: DragEndEvent) => {
			if (event.active.data.current?.relevance) {
				const prevRelevance = event.active.data.current?.relevance

				const timeframeDelta =
					dragStartTimeframe.current.start.getTime() -
					props.timeframe.start.getTime()

				const deltaX = event.delta.x
				const deltaInMilliseconds =
					(pixelsToMilliseconds(deltaX) + timeframeDelta) *
					(ganttDirection === 'rtl' ? -1 : 1)

				event.active.data.current.relevance = {
					start: snapDateToTimeframeGrid(
						addMilliseconds(prevRelevance.start, deltaInMilliseconds)
					),
					end: snapDateToTimeframeGrid(
						addMilliseconds(prevRelevance.end, deltaInMilliseconds)
					),
				}
			} else if (event.active.data.current?.duration) {
				const side = ganttDirection === 'rtl' ? 'right' : 'left'
				const activeSideX = event.active.rect.current.translated?.[side] || 0
				const ganttSideX =
					(ganttRef.current?.getBoundingClientRect()[side] || 0) + sidebarWidth

				const deltaX = activeSideX - ganttSideX

				const deltaInMilliseconds =
					pixelsToMilliseconds(deltaX) * (ganttDirection === 'rtl' ? -1 : 1)

				const activeDuration = event.active.data.current?.duration

				event.active.data.current.relevance = {
					start: snapDateToTimeframeGrid(
						addMilliseconds(props.timeframe.start, deltaInMilliseconds)
					),
					end: snapDateToTimeframeGrid(
						addMilliseconds(
							props.timeframe.start,
							deltaInMilliseconds + activeDuration
						)
					),
				}
			}

			props.onDragEnd(event)
		},
		[
			sidebarWidth,
			pixelsToMilliseconds,
			snapDateToTimeframeGrid,
			props.timeframe,
			ganttDirection,
		]
	)

	const onResizeEnd = useCallback(
		(event: ResizeEndEvent) => {
			const deltaInMilliseconds = pixelsToMilliseconds(event.delta.x)

			if (event.active.data.current?.relevance) {
				const prevRelevance = event.active.data.current?.relevance

				event.active.data.current.relevance[event.direction] =
					snapDateToTimeframeGrid(
						addMilliseconds(prevRelevance[event.direction], deltaInMilliseconds)
					)
			}

			props.onResizeEnd(event)
		},
		[pixelsToMilliseconds, snapDateToTimeframeGrid, props.onResizeEnd]
	)

	const onPanEnd = useCallback<OnPanEnd>(
		(deltaX: number, deltaY: number) => {
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
		[pixelsToMilliseconds, props.onTimeframeChanged, ganttDirection]
	)

	const onDragStart = useCallback(
		(event: DragStartEvent) => {
			if (event.active.data.current?.duration) {
				const width = millisecondsToPixels(event.active.data.current?.duration)
				event.active.data.current.width = width
			}

			dragStartTimeframe.current = props.timeframe

			props.onDragStart?.(event)
		},
		[millisecondsToPixels, props.onDragStart]
	)

	useDndMonitor({
		onDragStart,
		onDragEnd,
	})

	useLayoutEffect(() => {
		if (!ganttRef.current) return

		const mouseWheelHandler = (event: WheelEvent) => {
			if (!pressedKeys?.Meta) return

			event.preventDefault()
			onPanEnd(event.deltaX, event.deltaY)
		}

		ganttRef.current.addEventListener('wheel', mouseWheelHandler)

		return () => {
			ganttRef.current?.removeEventListener('wheel', mouseWheelHandler)
		}
	}, [onPanEnd, pressedKeys?.Meta])

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

	const value = useMemo<GanttBag>(
		() => ({
			style,
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
