import { minutesToMilliseconds } from "date-fns";
import type { Range } from "dnd-timeline";
import { useTimelineContext } from "dnd-timeline";
import { memo, useMemo } from "react";

interface Marker {
	label?: string;
	sideDelta: number;
	heightMultiplier: number;
}

export interface MarkerDefinition {
	value: number;
	maxRangeSize?: number;
	minRangeSize?: number;
	getLabel?: (time: Date) => string;
}

interface TimeAxisProps {
	range: Range;
	markers: MarkerDefinition[];
}

function TimeAxis(props: TimeAxisProps) {
	const { direction, sidebarWidth, valueToPixels } = useTimelineContext();

	const side = direction === "rtl" ? "right" : "left";

	const markers = useMemo(() => {
		const sortedMarkers = [...props.markers];
		sortedMarkers.sort((a, b) => b.value - a.value);

		const delta = sortedMarkers[sortedMarkers.length - 1].value;

		const rangeSize = props.range.end - props.range.start;

		const startTime = Math.floor(props.range.start / delta) * delta;

		const endTime = props.range.end;
		const timezoneOffset = minutesToMilliseconds(
			new Date().getTimezoneOffset(),
		);

		const markerSideDeltas: Marker[] = [];

		for (let time = startTime; time <= endTime; time += delta) {
			const multiplierIndex = sortedMarkers.findIndex(
				(marker) =>
					(time - timezoneOffset) % marker.value === 0 &&
					(!marker.maxRangeSize || rangeSize <= marker.maxRangeSize) &&
					(!marker.minRangeSize || rangeSize >= marker.minRangeSize),
			);

			if (multiplierIndex === -1) continue;

			const multiplier = sortedMarkers[multiplierIndex];

			const label = multiplier.getLabel?.(new Date(time));

			markerSideDeltas.push({
				label,
				heightMultiplier: 1 / (multiplierIndex + 1),
				sideDelta: valueToPixels(time - props.range.start, props.range),
			});
		}

		return markerSideDeltas;
	}, [props.range, valueToPixels, props.markers]);

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
