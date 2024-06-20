# Item

An item is an object that is placed inside of a row, and it's position and size is relative to its values.

{% hint style="info" %}
Item is an extension of dnd-kits's [Draggable](https://docs.dndkit.com/api-documentation/draggable).&#x20;

Please make sure you unserstand it's basic concepts before moving on.
{% endhint %}

`dnd-timeline` does not provide you with a `<Item />` component, so you will need to build your own.&#x20;

A basic Item component will look like this:

{% code title="Item.tsx" %}
```tsx
interface ItemProps {
  id: string
  span: Span
  children: ReactNode
}

function Item(props: ItemProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    itemStyle,
    itemContentStyle,
  } = useItem({
    id: props.id,
    span: props.span,
  })

  return (
    <div
      ref={setNodeRef}
      style={itemStyle}
      {...listeners}
      {...attributes}
    >
      <div style={itemContentStyle}>
        {props.children}
      </div>
    </div>
  )
}
```
{% endcode %}

You can fully customize this component according to your needs.

### Usage

Every `<Item />` component should be rendered as a child of it's parent row.

{% code title="Timeline.tsx" %}
```tsx
<Row id={row.id}>
  {groupedItems[row.id].map((item) => 
    <Item id={item.id} span={item.span}>
      // item content...
    </Item>
  )}
</Row>
```
{% endcode %}
