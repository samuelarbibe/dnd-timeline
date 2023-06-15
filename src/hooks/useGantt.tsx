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
import { DragEndEvent } from '@dnd-kit/core'

import { Timeframe } from '../types'
import { DragDirection, ItemDefinition } from './useItem'
import usePressedKeys from './usePressedKeys'

export type OnDragEnd = (event: DragEndEvent) => void

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
	onDragEnd: OnDragEnd
	onResizeEnd: OnResizeEnd
	direction: CanvasDirection
	timeframeGridSize?: number
	setGanttRef: React.RefObject<HTMLDivElement>
	sidebarWidth: number
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

export interface UseGanttProps {
	timeframe: Timeframe
	timeframeGridSize?: number
	onTimeframeChanged: OnTimeframeChanged
	onItemChanged: OnItemsChanged
	overlayed?: boolean
	direction?: 'rtl' | 'ltr'
}

const style: CSSProperties = {
	display: 'flex',
	overflow: 'hidden',
	flexDirection: 'column',
}

export default (props: UseGanttProps): Gantt => {
	const ganttRef = useRef<HTMLDivElement>(null)

	const [ganttWidth, setGanttWidth] = useState(0)
	const [sidebarWidth, setSidebarWidth] = useState(0)

	const pressedKeys = usePressedKeys()

	useLayoutEffect(() => {
		const element = ganttRef?.current
		if (!element) return

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
			if (!props.timeframeGridSize) return date

			return new Date(
				Math.round(date.getTime() / props.timeframeGridSize) *
					props.timeframeGridSize
			)
		},
		[props.timeframeGridSize]
	)

	const onDragEnd = useCallback<OnDragEnd>(
		(event) => {
			const overedRow = event.over?.id.toString()
			if (!overedRow) return

			const deltaX = event.delta.x
			const deltaInMilliseconds =
				pixelsToMilliseconds(deltaX) * (props.direction === 'rtl' ? -1 : 1)

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
			props.direction,
		]
	)

	const onResizeEnd = useCallback<OnResizeEnd>(
		(itemId: string, deltaX: number, side: 'start' | 'end') => {
			const deltaInMilliseconds =
				pixelsToMilliseconds(deltaX) * (props.direction === 'rtl' ? -1 : 1)

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
		[
			pixelsToMilliseconds,
			snapDateToTimeframeGrid,
			props.onItemChanged,
			props.direction,
		]
	)

	const onPanEnd = useCallback<OnPanEnd>(
		(deltaX: number, deltaY: number) => {
			if (!pressedKeys?.Meta) return

			const deltaXInMilliseconds =
				pixelsToMilliseconds(deltaX) * (props.direction === 'rtl' ? -1 : 1)
			const deltaYInMilliseconds =
				pixelsToMilliseconds(deltaY) * (props.direction === 'rtl' ? -1 : 1)

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
			props.direction,
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
			onResizeEnd,
			sidebarWidth,
			setSidebarWidth,
			pixelsToMilliseconds,
			millisecondsToPixels,
			setGanttRef: ganttRef,
			overlayed: !!props.overlayed,
			direction: props.direction || 'ltr',
			timeframe: props.timeframe,
			timeframeGridSize: props.timeframeGridSize,
		}),
		[
			style,
			onDragEnd,
			onResizeEnd,
			sidebarWidth,
			setSidebarWidth,
			pixelsToMilliseconds,
			millisecondsToPixels,
			props.timeframe,
			props.direction,
			props.overlayed,
			props.timeframeGridSize,
		]
	)

	return value
}
