import type { PropsWithChildren } from "react";

interface ItemContentProps extends PropsWithChildren {
	classes: string;
}

function ItemContent({ children, classes }: ItemContentProps) {
	return (
		<div
			className={`border-2 rounded-sm shadow-md w-full overflow-hidden flex flex-row pl-3 h-items-center ${classes}`}
		>
			{children}
		</div>
	);
}

export default ItemContent;
