import "./index.css";
import React from "react";
import { DragEndEvent } from "@dnd-kit/core";
import { endOfDay, startOfDay } from "date-fns";
import { ResizeEndEvent, Timeframe, TimelineContext } from "dnd-timeline";

import Timeline from "./Timeline";
import { generateItems, generateRows } from "./utils";

const DEFAULT_TIMEFRAME: Timeframe = {
  start: startOfDay(new Date()),
  end: endOfDay(new Date()),
};

function App() {
  const [timeframe, setTimeframe] = React.useState(DEFAULT_TIMEFRAME);

  const [rows] = React.useState(generateRows(1000));
  const [items, setItems] = React.useState(
    generateItems(1000, timeframe, rows)
  );

  const onResizeEnd = React.useCallback(
    (event: ResizeEndEvent) => {
      const updatedRelevance =
        event.active.data.current?.getRelevanceFromResizeEvent?.(event);

      if (!updatedRelevance) return;

      const activeItemId = event.active.id;

      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== activeItemId) return item;

          return {
            ...item,
            relevance: updatedRelevance,
          };
        })
      );
    },
    [setItems]
  );
  const onDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const activeRowId = event.over?.id as string;
      const updatedRelevance =
        event.active.data.current?.getRelevanceFromDragEvent?.(event);

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
        })
      );
    },
    [setItems]
  );

  return (
    <TimelineContext
      onDragEnd={onDragEnd}
      onResizeEnd={onResizeEnd}
      timeframe={timeframe}
      onTimeframeChanged={setTimeframe}
    >
      <Timeline rows={rows} items={items} />
    </TimelineContext>
  );
}

export default App;
