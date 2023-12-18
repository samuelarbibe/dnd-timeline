import { createContext } from "react";
import { DndContext } from "@dnd-kit/core";

import useTimeline from "../hooks/useTimeline";
import type { TimelineBag, TimelineContextProps } from "../types";

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
