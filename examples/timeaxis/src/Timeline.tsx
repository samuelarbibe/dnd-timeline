import type { ItemDefinition, RowDefinition } from "dnd-timeline";
import { groupItemsToSubrows, useTimelineContext } from "dnd-timeline";
import React, { useMemo } from "react";
import Row from "./Row";
import Sidebar from "./Sidebar";
import Item from "./Item";
import Subrow from "./Subrow";
import TimeAxis from "./TimeAxis";
import TimeCursor from "./TimeCursor";
import type { MarkerDefinition } from "./TimeAxis";
import { hoursToMilliseconds, format, minutesToMilliseconds } from "date-fns";

const timeAxisMarkers: MarkerDefinition[] = [
  {
    value: hoursToMilliseconds(24),
    getLabel: (date: Date) => format(date, "E"),
  },
  {
    value: hoursToMilliseconds(2),
    minTimeframeSize: hoursToMilliseconds(24),
    getLabel: (date: Date) => format(date, "k"),
  },
  {
    value: hoursToMilliseconds(1),
    minTimeframeSize: hoursToMilliseconds(24),
  },
  {
    value: hoursToMilliseconds(1),
    maxTimeframeSize: hoursToMilliseconds(24),
    getLabel: (date: Date) => format(date, "k"),
  },
  {
    value: minutesToMilliseconds(30),
    maxTimeframeSize: hoursToMilliseconds(24),
    minTimeframeSize: hoursToMilliseconds(12),
  },
  {
    value: minutesToMilliseconds(15),
    maxTimeframeSize: hoursToMilliseconds(12),
    getLabel: (date: Date) => format(date, "m"),
  },
  {
    value: minutesToMilliseconds(5),
    maxTimeframeSize: hoursToMilliseconds(6),
    minTimeframeSize: hoursToMilliseconds(3),
  },
  {
    value: minutesToMilliseconds(5),
    maxTimeframeSize: hoursToMilliseconds(3),
    getLabel: (date: Date) => format(date, "m"),
  },
  {
    value: minutesToMilliseconds(1),
    maxTimeframeSize: hoursToMilliseconds(2),
  },
];

interface TimelineProps {
  rows: RowDefinition[];
  items: ItemDefinition[];
}

function Timeline(props: TimelineProps) {
  const { setTimelineRef, style, timeframe } = useTimelineContext();

  const groupedSubrows = useMemo(
    () => groupItemsToSubrows(props.items, timeframe),
    [props.items, timeframe],
  );

  return (
    <div ref={setTimelineRef} style={style}>
      <TimeAxis markers={timeAxisMarkers} />
      <TimeCursor />
      {props.rows.map((row) => (
        <Row id={row.id} key={row.id} sidebar={<Sidebar row={row} />}>
          {groupedSubrows[row.id]?.map((subrow, index) => (
            <Subrow key={`${row.id}-${index}`}>
              {subrow.map((item) => (
                <Item id={item.id} key={item.id} relevance={item.relevance}>
                  {`Item ${item.id}`}
                </Item>
              ))}
            </Subrow>
          ))}
        </Row>
      ))}
    </div>
  );
}

export default Timeline;
