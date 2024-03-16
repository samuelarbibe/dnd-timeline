import "./index.css";
import React, { useCallback, useDeferredValue, useState } from "react";
import { endOfDay, startOfDay } from "date-fns";
import type { ResizeEndEvent, Timeframe, DragEndEvent } from "dnd-timeline";
import { TimelineContext } from "dnd-timeline";
import Timeline from "./Timeline";
import { generateItems, generateRows } from "./utils";
import { useDebounce, useThrottle } from "./hooks";

const DEFAULT_TIMEFRAME: Timeframe = {
  start: startOfDay(new Date()),
  end: endOfDay(new Date()),
};

enum TimeframeType {
  NORMAL = "Normal",
  DEBOUNCED = "Debounced",
  THROTTLED = "Throttled",
  DEFERRED = "Deferred",
}

function App() {
  const [timeframeType, setTimeframeType] = useState<TimeframeType>(
    TimeframeType.NORMAL,
  );

  const [timeframe, setTimeframe] = useState(DEFAULT_TIMEFRAME);
  const debouncedTimeframe = useDebounce(timeframe, 300);
  const throttledTimeframe = useThrottle(timeframe, 300);
  const deferredTimeframe = useDeferredValue(timeframe);

  const timeframeByType = {
    [TimeframeType.NORMAL]: timeframe,
    [TimeframeType.DEBOUNCED]: debouncedTimeframe,
    [TimeframeType.THROTTLED]: throttledTimeframe,
    [TimeframeType.DEFERRED]: deferredTimeframe,
  };

  const selectedTimeframe = timeframeByType[timeframeType];

  const [rows] = useState(generateRows(1));
  const [items, setItems] = useState(
    generateItems(500, selectedTimeframe, rows),
  );

  const onResizeEnd = useCallback(
    (event: ResizeEndEvent) => {
      const updatedRelevance =
        event.active.data.current.getRelevanceFromResizeEvent(event);

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
      const updatedRelevance =
        event.active.data.current.getRelevanceFromDragEvent(event);

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
    <>
      {Object.values(TimeframeType).map((timeframeTypeOption) => (
        <>
          <input
            checked={timeframeType === timeframeTypeOption}
            id={timeframeTypeOption}
            onClick={() => {
              setTimeframeType(timeframeTypeOption);
            }}
            type="radio"
            value={timeframeType}
          />
          <label htmlFor={timeframeTypeOption}>{timeframeTypeOption}</label>
        </>
      ))}
      <TimelineContext
        onDragEnd={onDragEnd}
        onResizeEnd={onResizeEnd}
        onTimeframeChanged={setTimeframe}
        timeframe={selectedTimeframe}
      >
        <Timeline items={items} rows={rows} timeframe={timeframe} />
      </TimelineContext>
    </>
  );
}

export default App;
