import {
  ItemDefinition,
  RowDefinition,
  groupItemsToSubrows,
  useTimelineContext,
} from "dnd-timeline";

import Row from "./Row";
import React from "react";
import Item from "./Item";
import Subrow from "./Subrow";
import Sidebar from "./Sidebar";

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

  return (
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
  );
}

export default Timeline;
