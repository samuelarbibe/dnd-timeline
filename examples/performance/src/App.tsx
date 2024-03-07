import "./index.css";
import React, { useCallback, useState } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import { endOfDay, startOfDay } from "date-fns";
import type {
  ResizeEndEvent,
  Timeframe,
  GetRelevanceFromResizeEvent,
  GetRelevanceFromDragEvent,
  OnTimeframeChanged,
} from "dnd-timeline";
import { TimelineContext } from "dnd-timeline";
import Timeline from "./Timeline";
import { generateItems, generateRows } from "./utils";
import { useDebounce, useThrottle } from "./hooks";

const DEFAULT_TIMEFRAME: Timeframe = {
  start: startOfDay(new Date()),
  end: endOfDay(new Date()),
};

enum TimeframeType {
  NORMAL = 'Normal',
  DEBOUNCED = 'Debounced',
  THROTTLED = 'Throttled'
}

function App() {
  const [timeframeType, setTimeframeType] = useState<TimeframeType>(TimeframeType.NORMAL)

  const [timeframe, setTimeframe] = useState(DEFAULT_TIMEFRAME);
  const debouncedTimeframe = useDebounce(timeframe, 300)
  const throttledTimeframe = useThrottle(timeframe, 300)

  const selectedTimeframe = timeframeType === TimeframeType.NORMAL
    ? timeframe
    : timeframeType === TimeframeType.DEBOUNCED
      ? debouncedTimeframe : throttledTimeframe

  const [rows] = useState(generateRows(1));
  const [items, setItems] = useState(generateItems(500, selectedTimeframe, rows));

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

  const handleOnTimeframeChanged: OnTimeframeChanged = (updateFunction) => {
    setTimeframe(updateFunction)
  }

  return (
    <>
      <input checked={timeframeType === TimeframeType.NORMAL} id={TimeframeType.NORMAL} onClick={() => { setTimeframeType(TimeframeType.NORMAL) }} type='radio' value={timeframeType} />
      <label htmlFor={TimeframeType.NORMAL}>{TimeframeType.NORMAL}</label>
      <input checked={timeframeType === TimeframeType.DEBOUNCED} id={TimeframeType.DEBOUNCED} onClick={() => { setTimeframeType(TimeframeType.DEBOUNCED) }} type='radio' value={timeframeType} />
      <label htmlFor={TimeframeType.DEBOUNCED}>{TimeframeType.DEBOUNCED}</label>
      <input checked={timeframeType === TimeframeType.THROTTLED} id={TimeframeType.THROTTLED} onClick={() => { setTimeframeType(TimeframeType.THROTTLED) }} type='radio' value={timeframeType} />
      <label htmlFor={TimeframeType.THROTTLED}>{TimeframeType.THROTTLED}</label>
      <TimelineContext
        onDragEnd={onDragEnd}
        onResizeEnd={onResizeEnd}
        onTimeframeChanged={handleOnTimeframeChanged}
        timeframe={selectedTimeframe}
      >
        <Timeline items={items} rows={rows} timeframe={timeframe} />
      </TimelineContext>
    </>
  );
}

export default App;

