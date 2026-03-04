import type { PropsWithChildren } from "react";
import { ROW_HEIGHT } from "../timeline/timeline";

interface ItemContentProps extends PropsWithChildren {
	classes: string;
}

function ItemContent({ children, classes }: ItemContentProps) {
	return (
		<div
			className={`border-2 rounded-sm shadow-md w-full overflow-hidden flex flex-row pl-3 h-[${ROW_HEIGHT}px] items-center ${classes}`}
		>
			{children}
		</div>
	);
}

export default ItemContent;
