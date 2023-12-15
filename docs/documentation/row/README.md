# Row

A row is a container for items.

The timeline is constructed of many rows, stacked on top of each other, where each row containes all the items related to it.

{% hint style="info" %}
Row is an extension of dnd-kits's [Droppable](https://docs.dndkit.com/api-documentation/droppable).&#x20;

Please make sure you unserstand it's basic concepts before moving on.
{% endhint %}

`dnd-timeline` does not provide you with a `<Row />` component, so you will need to build your own.&#x20;

A basic Row component will look like this:

{% code title="Row.tsx" %}

```tsx
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
    <div style={rowWrapperStyle}>
      <div ref={setSidebarRef} style={rowSidebarStyle}>
        {props.sidebar}
      </div>
      <div ref={setNodeRef} style={rowStyle}>
        {props.children}
      </div>
    </div>
  );
}
```

{% endcode %}

dnd-timeline also provides you with a helper type that you can extend.

```tsx
type RowDefinition = {
  id: string;
  disabled?: boolean;
};
```

You can fully customize this component according to your needs.

### Usage

Every `<Item />` component should be rendered as a child of it's parent row.

{% code title="Timeline.tsx" %}

```tsx
const { setTimelineRef, style } = useTimelineContext();

return (
  <div ref={setTimelineRef} style={style}>
    {rows.map((row) => (
      <Row id={row.id} sidebar={<Sidebar row={row} />}>
        // render row items...
      </Row>
    ))}
  </div>
);
```

{% endcode %}
