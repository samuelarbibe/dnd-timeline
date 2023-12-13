import {
  ItemDefinition,
  RowDefinition,
  groupItemsToSubrows,
  useTimelineContext,
} from "dnd-timeline";
import Row from "./Row";
import Sidebar from "./Sidebar";
import React from "react";
import Item from "./Item";
import Subrow from "./Subrow";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface TimelineProps {
  rows: RowDefinition[];
  items: ItemDefinition[];
}

function Timeline(props: TimelineProps) {
  const { setTimelineRef, style, timeframe } = useTimelineContext();

  const groupedSubrows = React.useMemo(
    () => groupItemsToSubrows(props.items, timeframe),
    [props.items, timeframe]
  );

  const rowIds = React.useMemo(
    () => props.rows.map(({ id }) => id),
    [props.rows]
  );

  return (
    <SortableContext items={rowIds} strategy={verticalListSortingStrategy}>
      <div ref={setTimelineRef} style={style}>
        {props.rows.map((row) => (
          <Row key={row.id} id={row.id} sidebar={<Sidebar row={row} />}>
            {groupedSubrows[row.id]?.map((subrow, index) => (
              <Subrow key={`${row.id}-${index}`}>
                {subrow.map((item) => (
                  <Item key={item.id} id={item.id} relevance={item.relevance}>
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
