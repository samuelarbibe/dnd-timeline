import React, { useMemo } from "react";
import { groupItemsToSubrows, useTimelineContext } from "dnd-timeline";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useAtom, useAtomValue } from "jotai";
import { itemsAtom, rowsAtom } from "@/store";
import Row from "./row";
import Sidebar from "./sidebar";
import Subrow from "./subrow";
import Item from "./item";
import { Large } from "../ui/large";
import { generateItems } from "@/lib/utils";
import { Button } from "../ui/button";
import { InlineCode } from "../ui/Inline-code";

function Timeline() {
  const rows = useAtomValue(rowsAtom)
  const [items, setItems] = useAtom(itemsAtom)
  const { setTimelineRef, style, timeframe } = useTimelineContext();

  const regenerateItems = () => {
    setItems(generateItems(10, timeframe, rows))
  }

  const groupedSubrows = useMemo(
    () => groupItemsToSubrows(items, timeframe),
    [items, timeframe],
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row items-center gap-2">
        Zoom In/Out:<InlineCode>cmd + scroll</InlineCode>
        Pan Right/Left:<InlineCode>cmd + shift + scroll</InlineCode>
        <div className="flex-1" />
        <Button className='self-end gap-2' onClick={() => { regenerateItems() }} variant='outline'>
          <ReloadIcon />
          Regenerate
        </Button>
      </div>
      <div className="select-none" ref={setTimelineRef} style={style}>
        {rows.map((row) => (
          <Row id={row.id} key={row.id} sidebar={<Sidebar row={row} />}>
            {groupedSubrows[row.id]?.map((subrow, index) => (
              <Subrow key={`${row.id}-${index}`}>
                {subrow.map((item) => (
                  <Item id={item.id} key={item.id} relevance={item.relevance}>
                    <Large>{`Item ${item.id}`}</Large>
                  </Item>
                ))}
              </Subrow>
            ))}
          </Row>
        ))
        }
      </div >
    </div>

  );
}

export default Timeline;
