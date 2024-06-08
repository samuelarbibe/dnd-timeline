import { Box, Text } from "@radix-ui/themes";
import type { RowDefinition } from "dnd-timeline";

interface SidebarProps {
	row: RowDefinition;
}

function Sidebar(props: SidebarProps) {
	return (
		<Box
			p="3"
			style={{
				width: "150px",
				backgroundColor: "var(--color-panel)",
				borderRight: "1px solid var(--gray-5)",
			}}
		>
			<Text weight="bold">{props.row.id}</Text>
		</Box>
	);
}

export default Sidebar;
