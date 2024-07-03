import type { PropsWithChildren } from "react";

interface ItemContentProps extends PropsWithChildren {
	bgColor: string;
}

function ItemContent({ children, bgColor }: ItemContentProps) {
	return (
		<div
			className={`border-2 rounded-sm shadow-md w-full overflow-hidden flex flex-row pl-3 h-items-center ${bgColor}`}
		>
			{children}
		</div>
	);
}

export default ItemContent;
