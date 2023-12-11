import { RowDefinition, useRow } from "dnd-timeline";

interface RowProps extends RowDefinition {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

function Row(props: RowProps) {
  const {
    setNodeRef,
    setSidebarRef,
    rowWrapperStyle,
    rowStyle,
    rowSidebarStyle,
  } = useRow({ id: props.id });

  return (
    <div style={{ ...rowWrapperStyle, minHeight: 50 }}>
      <div ref={setSidebarRef} style={rowSidebarStyle}>
        {props.sidebar}
      </div>
      <div ref={setNodeRef} style={{ ...rowStyle, border: "1px solid grey" }}>
        {props.children}
      </div>
    </div>
  );
}

export default Row;
