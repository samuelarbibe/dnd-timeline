import type { ItemDefinition, RowDefinition } from "dnd-timeline";
import { groupItemsToSubrows, useTimelineContext } from "dnd-timeline";
import React, { useCallback, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import Row from "./Row";
import Item from "./Item";
import Subrow from "./Subrow";
import Sidebar from "./Sidebar";
import GroupSidebar from "./GroupSidebar";

interface TimelineProps {
  rows: RowDefinition[];
  items: ItemDefinition[];
}

interface RowGroup {
  key: string;
  rows: RowDefinition[];
}

const getRowGroupKey = (rowId: string) => rowId.charAt(0);

function Timeline(props: TimelineProps) {
  const { setTimelineRef, timelineRef, style, timeframe } =
    useTimelineContext();

  const groupedSubrows = useMemo(
    () => groupItemsToSubrows(props.items, timeframe),
    [props.items, timeframe],
  );

  const sortedRows = useMemo(() => props.rows.sort((a, b) => a.id > b.id ? 1 : -1), [props.rows])

  const groupedRows = useMemo(() =>
    Object.values(
      sortedRows.reduce<Record<string, RowGroup>>((acc, row) => {
        const key = getRowGroupKey(row.id);
        if (!acc[key]) {
          acc[key] = {
            key,
            rows: []
          }
        }
        acc[key].rows.push(row);
        return acc;
      }, {})
    ).sort((a, b) => a.key > b.key ? 1 : -1), [sortedRows])

  const rowVirtualizer = useVirtualizer({
    count: sortedRows.length,
    getItemKey: (index) => sortedRows[index].id,
    getScrollElement: () => timelineRef.current,
    estimateSize: useCallback((index) =>
      (groupedSubrows[sortedRows[index].id]?.length || 1) * 50
      , [groupedSubrows, sortedRows])
  });

  const groupVirtualizer = useVirtualizer({
    count: groupedRows.length,
    getItemKey: (index) => index,
    getScrollElement: () => timelineRef.current,
    estimateSize: useCallback((index) =>
      groupedRows[index].rows.reduce((acc, row) => {
        const rowHeight = (groupedSubrows[row.id]?.length || 1) * 50
        return acc + rowHeight;
      }, 0)
      , [groupedRows, groupedSubrows])
  });

  return (
    <div
      ref={setTimelineRef}
      style={{
        ...style,
        height: "400px",
        overflowY: "auto",
        overflowX: "hidden",
        border: "1px solid white",
      }}
    >
      <div
        style={{
          minHeight: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {
          groupVirtualizer.getVirtualItems().map((virtualRow) => (
            <div
              key={virtualRow.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100px",
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <GroupSidebar label={groupedRows[virtualRow.index].key} />
            </div>
          ))
        }
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
              sidebar={
                <Sidebar row={sortedRows[virtualRow.index]} />
              }
            >
              {groupedSubrows[virtualRow.key]?.map((subrow, index) => (
                <Subrow key={`${virtualRow.key}-${index}`}>
                  {subrow.map((item) => (
                    <Item id={item.id} key={item.id} relevance={item.relevance}>
                      {item.id}
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
