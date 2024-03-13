import React from "react";
import type { RowDefinition } from "dnd-timeline";

interface SidebarProps {
  row: RowDefinition;
}

function Sidebar(props: SidebarProps) {
  return (
    <div
      style={{ width: 100, marginLeft: 100, border: "1px solid grey" }}
    >
      {props.row.id}
    </div>
  );
}

export default Sidebar;
