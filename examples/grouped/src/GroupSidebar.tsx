import React from "react";

interface GroupSidebarProps {
  label: string;
}

function GroupSidebar(props: GroupSidebarProps) {
  return (
    <div
      style={{ width: 100, height: "100%", border: "1px solid grey" }}
    >
      {props.label}
    </div>
  );
}

export default GroupSidebar;
