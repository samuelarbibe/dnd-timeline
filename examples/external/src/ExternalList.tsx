import ExternalItem, { ExternalItemDefinition } from "./ExternalItem";

interface ExternaListProps {
  items: ExternalItemDefinition[];
}

const ExternalList = (props: ExternaListProps) => {
  return (
    <div>
      {props.items.map((item) => (
        <ExternalItem item={item} />
      ))}
    </div>
  );
};

export default ExternalList;
