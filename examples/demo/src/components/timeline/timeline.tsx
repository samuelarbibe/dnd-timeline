import React, { useMemo } from "react";
import { groupItemsToSubrows, useTimelineContext } from "dnd-timeline";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useAtom, useAtomValue } from "jotai";
import { itemsAtom, rowsAtom } from "@/store";
import Row from "./row";
import Sidebar from "./sidebar";
import Subrow from "./subrow";
import Item from "./item";
import { generateItems } from "@/lib/utils";
import { Button } from "../ui/button";
import { InlineCode } from "../ui/Inline-code";
import { useVirtualizer } from "@tanstack/react-virtual";

function Timeline() {
  const rows = useAtomValue(rowsAtom);
  const [items, setItems] = useAtom(itemsAtom);
  const { setTimelineRef, style, timeframe, timelineRef } =
    useTimelineContext();

  const regenerateItems = () => {
    setItems(generateItems(50, timeframe, rows));
  };

  const groupedSubrows = useMemo(
    () => groupItemsToSubrows(items, timeframe),
    [items, timeframe],
  );

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getItemKey: (index) => rows[index].id,
    getScrollElement: () => timelineRef.current,
    estimateSize: (index) => (groupedSubrows[rows[index].id]?.length || 1) * 50,
  });

  return (
    <div className="flex max-w-7xl flex-col w-full gap-3">
      <div
        className="select-none rounded-lg border shadow-2xl shadow-slate-900"
        ref={setTimelineRef}
        style={{
          ...style,
          maxHeight: 400,
          overflowY: "auto",
          overflowX: "hidden",
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
                sidebar={<Sidebar row={rows[virtualRow.index]} />}
              >
                {groupedSubrows[virtualRow.key]?.map((subrow, index) => (
                  <Subrow key={`${virtualRow.key}-${index}`}>
                    {subrow.map((item) => (
                      <Item
                        id={item.id}
                        key={item.id}
                        relevance={item.relevance}
                      >
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
      <div className="flex flex-row items-center gap-2">
        Zoom In / Out:<InlineCode>⌘</InlineCode> +{" "}
        <InlineCode>scroll</InlineCode>
        Move Right / Left:<InlineCode>⌘</InlineCode> +{" "}
        <InlineCode>⇧</InlineCode> + <InlineCode>scroll</InlineCode>
        <div className="flex-1" />
        <Button
          className="self-end gap-2"
          onClick={() => {
            regenerateItems();
          }}
          variant="outline"
        >
          <ReloadIcon />
          Regenerate
        </Button>
      </div>
    </div>
  );
}

export default Timeline;
