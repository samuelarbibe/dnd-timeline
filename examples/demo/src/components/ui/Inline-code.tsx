import type { PropsWithChildren } from "react";

export function InlineCode(props: PropsWithChildren) {
	return (
		<code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
			{props.children}
		</code>
	);
}
