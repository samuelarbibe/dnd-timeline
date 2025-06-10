import type React from "react";
import { useState } from "react";

interface GroupProps {
	children: React.ReactNode;
	groupKey: string;
}

function Group(props: GroupProps) {
	const [expanded, setExpanded] = useState(true);

	return (
		<>
			<div
				style={{
					minHeight: 20,
					display: "inline-flex",
					alignItems: "stretch",
					backgroundColor: "grey",
				}}
			>
				<div
					onMouseDown={() => setExpanded((prev) => !prev)}
					style={{ width: 200, border: "1px solid grey" }}
				>{`Group ${props.groupKey} (Click to ${expanded ? "close" : "open"})`}</div>
				{"<Put row summary here>"}
			</div>
			{expanded && props.children}
		</>
	);
}

export default Group;
