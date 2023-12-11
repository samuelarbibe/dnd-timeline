import { useDraggable } from "@dnd-kit/core";
import { ItemDefinition, useTimelineContext } from "dnd-timeline";

import { ItemType } from "./utils";

export interface ExternalItemDefinition
  extends Omit<ItemDefinition, "relevance"> {
  duration: number;
}

interface ListItemProps {
  item: ExternalItemDefinition;
}

const ExternalItem = (props: ListItemProps) => {
  const { getRelevanceFromDragEvent, millisecondsToPixels } =
    useTimelineContext();

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.item.id,
    data: {
      type: ItemType.EXTERNAL_ITEM,
      duration: props.item.duration,
      getRelevanceFromDragEvent,
    },
  });

  const style = {
    height: "50px",
    width: millisecondsToPixels(props.item.duration),
    border: "1px solid white",
    ...(transform && {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    }),
  };

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
      {props.item.id}
    </div>
  );
};

export default ExternalItem;
