import type { ItemDefinition, RowDefinition } from "dnd-timeline";
import { groupItemsToSubrows, useTimelineContext } from "dnd-timeline";
import React, { useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import Row from "./Row";
import Item from "./Item";
import Subrow from "./Subrow";
import Sidebar from "./Sidebar";

interface TimelineProps {
  rows: RowDefinition[];
  items: ItemDefinition[];
}

function Timeline(props: TimelineProps) {
  const { setTimelineRef, timelineRef, style, timeframe } =
    useTimelineContext();

  const groupedSubrows = useMemo(
    () => groupItemsToSubrows(props.items, timeframe),
    [props.items, timeframe],
  );

  const rowVirtualizer = useVirtualizer({
    count: props.rows.length,
    getItemKey: (index) => props.rows[index].id,
    getScrollElement: () => timelineRef.current,
    estimateSize: (index) =>
      (groupedSubrows[props.rows[index].id]?.length || 1) * 50,
  });

  return (
    <div
      ref={setTimelineRef}
      style={{
        ...style,
        height: 400,
        overflowY: "auto",
        overflowX: "hidden",
        border: "1px solid white",
      }}
    >
      <div
        style={{
          minHeight: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.key}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <Row
              id={virtualRow.key as string}
              key={virtualRow.key}
              sidebar={<Sidebar row={props.rows[virtualRow.index]} />}
            >
              {groupedSubrows[virtualRow.key]?.map((subrow, index) => (
                <Subrow key={`${virtualRow.key}-${index}`}>
                  {subrow.map((item) => (
                    <Item id={item.id} key={item.id} relevance={item.relevance}>
                      {`Item ${item.id}`}
                    </Item>
                  ))}
                </Subrow>
              ))}
            </Row>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Timeline;
