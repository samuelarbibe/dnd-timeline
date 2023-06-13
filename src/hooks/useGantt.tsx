import {
	CSSProperties,
	useCallback,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import ResizeObserver from 'resize-observer-polyfill'
import { DragEndEvent } from '@dnd-kit/core'

import { Timeframe } from '../types'
import { differenceInMilliseconds } from 'date-fns'

export type OnDragEndHandler = (event: DragEndEvent) => void

export type Gantt = {
	style: CSSProperties
	timeframe: Timeframe
	overlayed: boolean
	handleOnDragEnd: OnDragEndHandler
	direction: 'rtl' | 'ltr'
	setGanttRef: React.RefObject<HTMLDivElement>
	setSidebarWidth: React.Dispatch<React.SetStateAction<number>>
	millisecondsToPixels: MillisecondsToPixels
	pixelsToMilliseconds: PixelsToMilliseconds
}

export type MillisecondsToPixels = (milliseconds: number) => number
export type PixelsToMilliseconds = (pixels: number) => number

export type OnItemsChanged = (
	itemId: string,
	delta: { rowId?: string; relevance?: { start?: number; end?: number } }
) => void

export interface UseGanttProps {
	timeframe: Timeframe
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

	const resizeItemHandler = useCallback<OnDragEndHandler>(
		(event) => {
			const overedRow = event.over?.id.toString()
			const originRow = event.active?.data.current?.rowId
			if (overedRow !== originRow) return

			const activeItemId = event.active?.data.current?.itemId

			const side = event.active.data.current?.side // TODO: add type
			const deltaX = event.delta.x * (props.direction === 'rtl' ? -1 : 1)
			const deltaInMilliseconds =
				pixelsToMilliseconds(deltaX) * (props.direction === 'rtl' ? -1 : 1)

			props.onItemChanged(activeItemId, {
				relevance: {
					[side]: deltaInMilliseconds,
				},
			})
		},
		[pixelsToMilliseconds, props.onItemChanged, props.direction]
	)

	const moveItemHandler = useCallback<OnDragEndHandler>(
		(event) => {
			const overedRow = event.over?.id.toString()
			if (!overedRow) return

			const deltaX = event.delta.x * (props.direction === 'rtl' ? -1 : 1)

			const deltaInMilliseconds = pixelsToMilliseconds(deltaX)

			const activeItemId = event.active.id.toString()

			props.onItemChanged(activeItemId, {
				rowId: overedRow,
				relevance: {
					start: deltaInMilliseconds,
					end: deltaInMilliseconds,
				},
			})
		},
		[pixelsToMilliseconds, props.onItemChanged, props.direction]
	)

	const handleOnDragEnd = useCallback<OnDragEndHandler>(
		(event: DragEndEvent) => {
			if (event.active.data.current?.type === 'resizer') {
				return resizeItemHandler(event)
			} else {
				return moveItemHandler(event)
			}
		},
		[resizeItemHandler, moveItemHandler]
	)

	const value = useMemo<Gantt>(
		() => ({
			style,
			overlayed: !!props.overlayed,
			setSidebarWidth,
			handleOnDragEnd,
			pixelsToMilliseconds,
			millisecondsToPixels,
			setGanttRef: ganttRef,
			direction: props.direction || 'ltr',
			timeframe: props.timeframe,
		}),
		[
			style,
			setSidebarWidth,
			handleOnDragEnd,
			pixelsToMilliseconds,
			millisecondsToPixels,
			props.timeframe,
			props.direction,
			props.overlayed,
		]
	)

	return value
}
