import type { PropsWithChildren } from "react";
import React, { createContext } from "react";
import type { DndContextProps } from "@dnd-kit/core";
import { DndContext } from "@dnd-kit/core";
import type { UseTimelineProps, TimelineBag } from "../hooks/useTimeline";
import useTimeline from "../hooks/useTimeline";

export interface TimelineContextProps
  extends PropsWithChildren,
    UseTimelineProps,
    DndContextProps {}

export const timelineContext = createContext<TimelineBag | undefined>(
  undefined,
);

export const TimelineProvider = timelineContext.Provider;

function TimelineProviderInner(props: TimelineContextProps) {
  const timeline = useTimeline(props);

  return <TimelineProvider value={timeline}>{props.children}</TimelineProvider>;
}

export function TimelineContext(props: TimelineContextProps) {
  return (
    <DndContext {...props}>
      <TimelineProviderInner {...props}>{props.children}</TimelineProviderInner>
    </DndContext>
  );
}
