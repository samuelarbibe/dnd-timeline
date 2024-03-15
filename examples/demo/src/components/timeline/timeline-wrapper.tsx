import type { PropsWithChildren } from "react";
import React, { useCallback, useState } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import { endOfDay, startOfDay } from "date-fns";
import type {
  ResizeEndEvent,
  Timeframe,
  GetRelevanceFromResizeEvent,
  GetRelevanceFromDragEvent,
} from "dnd-timeline";
import { TimelineContext } from "dnd-timeline";
import { useSetAtom } from "jotai";
import { itemsAtom } from "@/store";

const DEFAULT_TIMEFRAME: Timeframe = {
  start: startOfDay(new Date()),
  end: endOfDay(new Date()),
};

function TimelineWrapper(props: PropsWithChildren) {
  const [timeframe, setTimeframe] = useState(DEFAULT_TIMEFRAME);

  const setItems = useSetAtom(itemsAtom);

  const onResizeEnd = useCallback(
    (event: ResizeEndEvent) => {
      const getRelevanceFromResizeEvent = event.active.data.current
        ?.getRelevanceFromResizeEvent as GetRelevanceFromResizeEvent;

      const updatedRelevance = getRelevanceFromResizeEvent(event);

      if (!updatedRelevance) return;

      const activeItemId = event.active.id;

      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== activeItemId) return item;

          return {
            ...item,
            relevance: updatedRelevance,
          };
        }),
      );
    },
    [setItems],
  );

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const activeRowId = event.over?.id as string;

      const getRelevanceFromDragEvent = event.active.data.current
        ?.getRelevanceFromDragEvent as GetRelevanceFromDragEvent;

      const updatedRelevance = getRelevanceFromDragEvent(event);

      if (!updatedRelevance || !activeRowId) return;

      const activeItemId = event.active.id;

      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== activeItemId) return item;

          return {
            ...item,
            rowId: activeRowId,
            relevance: updatedRelevance,
          };
        }),
      );
    },
    [setItems],
  );

  return (
    <TimelineContext
      onDragEnd={onDragEnd}
      onResizeEnd={onResizeEnd}
      onTimeframeChanged={setTimeframe}
      timeframe={timeframe}
    >
      {props.children}
    </TimelineContext>
  );
}

export default TimelineWrapper;
