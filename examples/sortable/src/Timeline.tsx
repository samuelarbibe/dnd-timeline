import type { ItemDefinition, RowDefinition } from "dnd-timeline";
import { groupItemsToSubrows, useTimelineContext } from "dnd-timeline";
import React, { useMemo } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Row from "./Row";
import Sidebar from "./Sidebar";
import Item from "./Item";
import Subrow from "./Subrow";

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

  const rowIds = useMemo(() => props.rows.map(({ id }) => id), [props.rows]);

  return (
    <SortableContext items={rowIds} strategy={verticalListSortingStrategy}>
      <div ref={setTimelineRef} style={style}>
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
    </SortableContext>
  );
}

export default Timeline;
