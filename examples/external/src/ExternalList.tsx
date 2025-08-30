import type { ExternalItemDefinition } from "./ExternalItem";
import ExternalItem from "./ExternalItem";

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
