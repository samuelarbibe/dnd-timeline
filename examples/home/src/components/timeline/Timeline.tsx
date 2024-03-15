import React, { useMemo } from "react";
import { groupItemsToSubrows, useTimelineContext } from "dnd-timeline";
import { useAtom, useAtomValue } from "jotai";
import Row from "./Row";
import Sidebar from "./Sidebar";
import Subrow from "./Subrow";
import Item from "./Item";
import { generateItems } from "../../utils";
import { itemsAtom, rowsAtom } from "../../store";
import { Button, Card, Flex, Inset, Kbd, Text } from "@radix-ui/themes";
import { ReloadIcon } from "@radix-ui/react-icons";

function Timeline() {
  const rows = useAtomValue(rowsAtom);
  const [items, setItems] = useAtom(itemsAtom);
  const { setTimelineRef, style, timeframe } = useTimelineContext();

  const regenerateItems = () => {
    setItems(generateItems(10, timeframe, rows));
  };

  const groupedSubrows = useMemo(
    () => groupItemsToSubrows(items, timeframe),
    [items, timeframe],
  );

  return (
    <Flex direction="column" gap="3">
      <Flex direction="row" justify="end">
        <Button
          onClick={() => {
            regenerateItems();
          }}
          variant="ghost"
        >
          <ReloadIcon /> Regenrate
        </Button>
      </Flex>
      <Card variant="surface">
        <Inset className="select-none" ref={setTimelineRef} style={style}>
          {rows.map((row) => (
            <Row id={row.id} key={row.id} sidebar={<Sidebar row={row} />}>
              {groupedSubrows[row.id]?.map((subrow, index) => (
                <Subrow key={`${row.id}-${index}`}>
                  {subrow.map((item) => (
                    <Item id={item.id} key={item.id} relevance={item.relevance}>
                      <Text>{item.id}</Text>
                    </Item>
                  ))}
                </Subrow>
              ))}
            </Row>
          ))}
        </Inset>
      </Card>
      <Flex direction="row" gap="4" justify="start">
        <Flex align="end" direction="row" gap="2">
          <Text color="gray">Zoom In / Out:</Text>
          <Kbd>⌘</Kbd>+<Kbd>Wheel</Kbd>
        </Flex>
        <Flex align="end" direction="row" gap="2">
          <Text color="gray">Move Right / Left:</Text>
          <Kbd>⌘</Kbd>+<Kbd>⇧</Kbd>+<Kbd>Wheel</Kbd>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Timeline;
