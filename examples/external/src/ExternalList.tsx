import React from "react";
import ExternalItem from "./ExternalItem";
import type { ExternalItemDefinition } from "./ExternalItem";

interface ExternaListProps {
  items: ExternalItemDefinition[];
}

function ExternalList(props: ExternaListProps) {
  return (
    <div>
      {props.items.map((item) => (
        <ExternalItem item={item} key={item.id} />
      ))}
    </div>
  );
}

export default ExternalList;
