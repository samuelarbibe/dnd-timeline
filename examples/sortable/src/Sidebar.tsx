import { RowDefinition } from "dnd-timeline";
import { useSortable } from "@dnd-kit/sortable";

import { ItemType } from "./utils";

interface SidebarProps {
  row: RowDefinition;
}

function Sidebar(props: SidebarProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.row.id, data: { type: ItemType.SIDEBAR_ITEM } });

  const style = {
    transition,
    width: "200px",
    border: "1px solid grey",
    ...(transform && {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    }),
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {`Row ${props.row.id}`}
    </div>
  );
}

export default Sidebar;
