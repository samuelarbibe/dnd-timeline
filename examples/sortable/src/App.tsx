import "./index.css";
import React from "react";
import { DragEndEvent, closestCenter } from "@dnd-kit/core";
import { endOfDay, startOfDay } from "date-fns";
import { ResizeEndEvent, Timeframe, TimelineContext } from "dnd-timeline";

import Timeline from "./Timeline";
import { ItemType, generateItems, generateRows } from "./utils";
import { arrayMove } from "@dnd-kit/sortable";

const DEFAULT_TIMEFRAME: Timeframe = {
  start: startOfDay(new Date()),
  end: endOfDay(new Date()),
};

function App() {
  const [timeframe, setTimeframe] = React.useState(DEFAULT_TIMEFRAME);

  const [rows, setRows] = React.useState(generateRows(5));
  const [items, setItems] = React.useState(generateItems(10, timeframe, rows));

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

  const onDragEnd = React.useCallback((event: DragEndEvent) => {
    const overedId = event.over?.id as string;

    if (!overedId) return;

    const activeId = event.active.id;
    const activeItemType = event.active.data.current?.type as ItemType;
    const updatedRelevance =
      event.active.data.current?.getRelevanceFromDragEvent?.(event);

    if (updatedRelevance && activeItemType === ItemType.LIST_ITEM) {
      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== activeId) return item;

          return {
            ...item,
            rowId: overedId,
            relevance: updatedRelevance,
          };
        })
      );
    } else if (activeItemType === ItemType.SIDEBAR_ITEM) {
      setRows((prev) => {
        const oldIndex = prev.findIndex((row) => row.id === activeId);
        const newIndex = prev.findIndex((row) => row.id === overedId);

        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }, []);

  return (
    <TimelineContext
      onDragEnd={onDragEnd}
      onResizeEnd={onResizeEnd}
      timeframe={timeframe}
      collisionDetection={closestCenter}
      onTimeframeChanged={setTimeframe}
    >
      <Timeline rows={rows} items={items} />
    </TimelineContext>
  );
}

export default App;
