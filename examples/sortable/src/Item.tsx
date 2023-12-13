import { Relevance, useItem } from "dnd-timeline";
import { ItemType } from "./utils";

interface ItemProps {
  id: string;
  relevance: Relevance;
  children: React.ReactNode;
}

function Item(props: ItemProps) {
  const { setNodeRef, attributes, listeners, itemStyle, itemContentStyle } =
    useItem({
      id: props.id,
      relevance: props.relevance,
      data: {
        type: ItemType.LIST_ITEM,
      },
    });

  return (
    <div ref={setNodeRef} style={itemStyle} {...listeners} {...attributes}>
      <div style={itemContentStyle}>
        <div style={{ border: "1px solid white", width: "100%" }}>
          {props.children}
        </div>
      </div>
    </div>
  );
}

export default Item;
