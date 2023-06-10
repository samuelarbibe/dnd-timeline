import { differenceInMilliseconds } from 'date-fns'

import { Timeframe } from '../types'

export const millisecondsToPixels = (
	milliseconds: number,
	timeframe: Timeframe,
	clientWidth: number
) => {
	const msToPixel =
		clientWidth / differenceInMilliseconds(timeframe.end, timeframe.start)
	return milliseconds * msToPixel
}

export const pixelsToMilliseconds = (
	pixels: number,
	timeframe: Timeframe,
	clientWidth: number
) => {
	const pixelToMs =
		differenceInMilliseconds(timeframe.end, timeframe.start) / clientWidth
	return pixels * pixelToMs
}
