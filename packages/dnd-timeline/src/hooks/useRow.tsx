import type { CSSProperties } from "react";
import { useDroppable } from "@dnd-kit/core";

import type { UseRowProps } from "../types";

import useTimelineContext from "./useTimelineContext";

export default function useRow(props: UseRowProps) {
  const { setSidebarRef } = useTimelineContext();

  const droppableProps = useDroppable({
    id: props.id,
    data: props.data,
    disabled: props.disabled,
  });

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

  const rowSidebarStyle: CSSProperties = {
    left: 0,
    zIndex: 3,
    display: "flex",
  };

  return {
    rowStyle,
    rowWrapperStyle,
    rowSidebarStyle,
    setSidebarRef,
    ...droppableProps,
  };
}
