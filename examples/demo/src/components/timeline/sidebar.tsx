import type { RowDefinition } from "dnd-timeline";
import React from "react";

interface SidebarProps {
  row: RowDefinition;
}

function Sidebar(props: SidebarProps) {
  return (
    <div className="border-r w-56 flex flex-row items-center pl-3">
      <span>{`Row ${props.row.id}`}</span>
    </div>
  );
}

export default Sidebar;
