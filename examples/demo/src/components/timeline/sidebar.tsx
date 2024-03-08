import type { RowDefinition } from "dnd-timeline";
import React from "react";
import { Large } from "../ui/large";

interface SidebarProps {
  row: RowDefinition;
}

function Sidebar(props: SidebarProps) {
  return (
    <div className="border-r w-56 flex flex-row items-center pl-3">
      <Large>{`Row ${props.row.id}`}</Large>
    </div>
  );
}

export default Sidebar;
