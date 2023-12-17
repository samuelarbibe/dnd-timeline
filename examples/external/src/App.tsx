import "./index.css";
import React, { useCallback, useState } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import { endOfDay, startOfDay } from "date-fns";
import type {
  GetRelevanceFromDragEvent,
  GetRelevanceFromResizeEvent,
  ResizeEndEvent,
  Timeframe,
} from "dnd-timeline";
import { TimelineContext } from "dnd-timeline";
import Timeline from "./Timeline";
import ExternalList from "./ExternalList";
import {
  ItemType,
  generateExternalItems,
  generateItems,
  generateRows,
} from "./utils";

const DEFAULT_TIMEFRAME: Timeframe = {
  start: startOfDay(new Date()),
  end: endOfDay(new Date()),
};

function App() {
  const [timeframe, setTimeframe] = useState(DEFAULT_TIMEFRAME);

  const [rows] = useState(generateRows(5));
  const [items, setItems] = useState(generateItems(10, timeframe, rows));
  const [externalItems, setExternalItems] = useState(
    generateExternalItems(10, timeframe, rows),
  );

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

      const activeItemId = event.active.id.toString();
      const activeItemType = event.active.data.current?.type as ItemType;

      if (activeItemType === ItemType.ListItem) {
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
      } else if (activeItemType === ItemType.ExternalItem) {
        setItems((prev) => [
          ...prev,
          {
            id: activeItemId,
            rowId: activeRowId,
            relevance: updatedRelevance,
          },
        ]);
        setExternalItems((prev) =>
          prev.filter((item) => item.id !== activeItemId),
        );
      }
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
      <Timeline items={items} rows={rows} />
      <ExternalList items={externalItems} />
    </TimelineContext>
  );
}

export default App;
