import React, { useMemo, memo } from "react";

import { minutesToMilliseconds } from "date-fns";
import { useTimelineContext } from "dnd-timeline";

interface Marker {
	label?: string;
	sideDelta: number;
	heightMultiplier: number;
}

export interface MarkerDefinition {
	value: number;
	maxTimeframeSize?: number;
	minTimeframeSize?: number;
	getLabel?: (time: Date) => string;
}

interface TimeAxisProps {
	markers: MarkerDefinition[];
}

function TimeAxis(props: TimeAxisProps) {
	const { timeframe, timelineDirection, sidebarWidth, millisecondsToPixels } =
		useTimelineContext();

	const side = timelineDirection === "rtl" ? "right" : "left";

	const markers = useMemo(() => {
		const sortedMarkers = [...props.markers];
		sortedMarkers.sort((a, b) => b.value - a.value);

		const delta = sortedMarkers[sortedMarkers.length - 1].value;

		const timeframeSize = timeframe.end.getTime() - timeframe.start.getTime();

		const startTime = Math.floor(timeframe.start.getTime() / delta) * delta;

		const endTime = timeframe.end.getTime();
		const timezoneOffset = minutesToMilliseconds(
			new Date().getTimezoneOffset(),
		);

		const markerSideDeltas: Marker[] = [];

		for (let time = startTime; time <= endTime; time += delta) {
			const multiplierIndex = sortedMarkers.findIndex(
				(marker) =>
					(time - timezoneOffset) % marker.value === 0 &&
					(!marker.maxTimeframeSize ||
						timeframeSize <= marker.maxTimeframeSize) &&
					(!marker.minTimeframeSize ||
						timeframeSize >= marker.minTimeframeSize),
			);

			if (multiplierIndex === -1) continue;

			const multiplier = sortedMarkers[multiplierIndex];

			const label = multiplier.getLabel?.(new Date(time));

			markerSideDeltas.push({
				label,
				heightMultiplier: 1 / (multiplierIndex + 1),
				sideDelta: millisecondsToPixels(time - timeframe.start.getTime()),
			});
		}

		return markerSideDeltas;
	}, [timeframe, millisecondsToPixels, props.markers]);

	return (
		<div
			style={{
				height: "20px",
				position: "relative",
				overflow: "hidden",
				[side === "right" ? "marginRight" : "marginLeft"]: `${sidebarWidth}px`,
			}}
		>
			{markers.map((marker, index) => (
				<div
					key={`${marker.sideDelta}-${index}`}
					style={{
						position: "absolute",
						bottom: 0,
						display: "flex",
						flexDirection: "row",
						justifyContent: "flex-start",
						alignItems: "flex-end",
						height: "100%",
						[side]: `${marker.sideDelta}px`,
					}}
				>
					<div
						style={{
							width: "1px",
							height: `${100 * marker.heightMultiplier}%`,
						}}
					/>
					{marker.label ? (
						<div
							style={{
								paddingLeft: "3px",
								alignSelf: "flex-start",
								fontWeight: marker.heightMultiplier * 1000,
							}}
						>
							{marker.label}
						</div>
					) : null}
				</div>
			))}
		</div>
	);
}

export default memo(TimeAxis);
