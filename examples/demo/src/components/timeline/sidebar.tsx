import type { RowDefinition } from "dnd-timeline";

interface SidebarProps {
	row: RowDefinition;
}

function Sidebar(props: SidebarProps) {
	return (
		<div className="border-r w-full flex flex-row items-center pl-3">
			<span>{`Row ${props.row.id}`}</span>
		</div>
	);
}

export default Sidebar;
