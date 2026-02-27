import { useDroppable } from "@dnd-kit/core";
import { type CSSProperties, useMemo } from "react";

import type { UseRowProps } from "../types";

import useTimelineContext from "./useTimelineContext";

const rowWrapperStyle: CSSProperties = {
	display: "inline-flex",
};

const rowStyle: CSSProperties = {
	flex: 1,
	display: "flex",
	position: "relative",
	alignItems: "stretch",
	flexDirection: "column",
};

const baseRowSidebarStyle: CSSProperties = {
	left: 0,
	zIndex: 3,
	display: "flex",
};

export default function useRow(props: UseRowProps) {
	const { sidebarWidth } = useTimelineContext();

	const rowSidebarStyle = useMemo<CSSProperties>(
		() => ({ ...baseRowSidebarStyle, width: sidebarWidth }),
		[sidebarWidth],
	);

	const droppableProps = useDroppable({
		id: props.id,
		data: props.data,
		disabled: props.disabled,
	});

	return {
		rowStyle,
		rowWrapperStyle,
		rowSidebarStyle,
		...droppableProps,
	};
}
