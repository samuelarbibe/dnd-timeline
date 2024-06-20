# useItem

A hook to declare a timeline item.

Use this hook to declare an HTML element as an item in the timeline.

{% hint style="info" %}
This hook is based on dnd-kit's [useDraggable](https://docs.dndkit.com/api-documentation/draggable/usedraggable) hook.

Please make sure you fully understand it's concepts before trying to use it here.
{% endhint %}

### Options

#### `id`

```tsx
id: string
```

A unique id to identify this item.

#### `span`

```tsx
span: Span
```

An object representing the start and end values of the item.

#### `disabled?`

```tsx
disabled?: boolean
```

An optional boolean to disable the interactivity of the item.

#### `data?`

```tsx
data?: object
```

Custom data that can be passed to the row.

> 🧠 This can be passed to rows to identify their type. This type can later be used in the event callbacks to apply different behaviors to different row types.
>
> {% code title="Item.tsx" %}
> ```tsx
> useItem({
>   id: props.id,
>   span: props.span,
>   data: { type: 'timeline-item' },
> })
> ```
> {% endcode %}
>
> {% code title="Timeline.tsx" %}
> ```tsx
> const onDragEnd = (event: DragEndEvent) => {
>   const updatedSpan =
>     event.active.data.current.getSpanFromDragEvent?.(event)
>
>   const rowType = event.active.data.current.type
>   
>   if (rowType === 'timeline-row' && itemType === 'timeline-item') {
>     // update
>   }
>     
>   if (rowType === 'timeline-disabled-row' && itemType === 'timeline-item') {
>     // don't update, and pop an error message
>   }
> }
> ```
> {% endcode %}

### Events

useItem can also receive callbacks, that will be called when the relevant event is triggered.

For example:

```tsx
const onResizeMove = useCallback(() => {
  const updatedSpan =
    event.active.data.current.getSpanFromResizeEvent?.(event)

  // update some local state with the updated-span
}, [])

useItem({
  id: props.id,
  span: props.span,
  onResizeMove,
})
```

#### onResizeStart?

```tsx
onResizeMove?: (event: ResizeStartEvent) => void
```

```tsx
type ResizeStartEvent = {
  active: Omit<Active, 'rect'>
  direction: DragDirection // 'start' | 'end'
}
```

#### onResizeMove?

```tsx
onResizeMove?: (event: ResizeMoveEvent) => void
```

```tsx
type ResizeMoveEvent = {
  active: Omit<Active, 'rect'>
  delta: {
    x: number
  }
  direction: DragDirection // 'start' | 'end'
}
```

#### onResizeEnd?

```tsx
onResizeMove?: (event: ResizeEndEvent) => void
```

```tsx
type ResizeEndEvent = {
  active: Omit<Active, 'rect'>
  delta: {
    x: number
  }
  direction: DragDirection // 'start' | 'end'
}
```

### API

{% hint style="info" %}
All of dnd-kit [useDraggable](https://docs.dndkit.com/api-documentation/draggable/usedraggable#properties) api are returned as well.
{% endhint %}

#### `itemStyle`

```tsx
itemStyle: CSSProperties
```

Basic style properties that must be passed to the item wrapper element.

#### `itemContentStyle`

```tsx
itemContentStyle: CSSProperties
```

Basic style properties that must be passed to the item's children wrapper element.
