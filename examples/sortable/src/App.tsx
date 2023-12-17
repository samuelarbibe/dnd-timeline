import "./index.css";
import React, { useCallback, useState } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import { closestCenter } from "@dnd-kit/core";
import { endOfDay, startOfDay } from "date-fns";
import type {
  GetRelevanceFromDragEvent,
  GetRelevanceFromResizeEvent,
  ResizeEndEvent,
  Timeframe,
} from "dnd-timeline";
import { TimelineContext } from "dnd-timeline";
import { arrayMove } from "@dnd-kit/sortable";
import Timeline from "./Timeline";
import { ItemType, generateItems, generateRows } from "./utils";

const DEFAULT_TIMEFRAME: Timeframe = {
  start: startOfDay(new Date()),
  end: endOfDay(new Date()),
};

function App() {
  const [timeframe, setTimeframe] = useState(DEFAULT_TIMEFRAME);

  const [rows, setRows] = useState(generateRows(5));
  const [items, setItems] = useState(generateItems(10, timeframe, rows));

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

  const onDragEnd = useCallback((event: DragEndEvent) => {
    const overedId = event.over?.id as string;

    if (!overedId) return;

    const activeId = event.active.id;
    const activeItemType = event.active.data.current?.type as ItemType;

    const getRelevanceFromDragEvent = event.active.data.current
      ?.getRelevanceFromDragEvent as GetRelevanceFromDragEvent;

    const updatedRelevance = getRelevanceFromDragEvent(event);

    if (updatedRelevance && activeItemType === ItemType.ListItem) {
      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== activeId) return item;

          return {
            ...item,
            rowId: overedId,
            relevance: updatedRelevance,
          };
        }),
      );
    } else if (activeItemType === ItemType.SidebarItem) {
      setRows((prev) => {
        const oldIndex = prev.findIndex((row) => row.id === activeId);
        const newIndex = prev.findIndex((row) => row.id === overedId);

        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }, []);

  return (
    <TimelineContext
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
      onResizeEnd={onResizeEnd}
      onTimeframeChanged={setTimeframe}
      timeframe={timeframe}
    >
      <Timeline items={items} rows={rows} />
    </TimelineContext>
  );
}

export default App;
