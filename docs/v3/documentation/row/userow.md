---
metaLinks:
  alternates:
    - https://app.gitbook.com/s/80Y6kfGWIGJve16WSQR3/documentation/row/userow
---

# useRow

A hook to declare a timeline row.

Use this hook to declare an HTML element as a row in the timeline.

{% hint style="info" %}
This hook is based on dnd-kit's [useDroppable](https://docs.dndkit.com/api-documentation/droppable/usedroppable) hook.

Please make sure you fully understand it's concepts before trying to use it here.
{% endhint %}

### Options

#### `id`

```tsx
id: string;
```

A unique id for this row. This id will later be used to bind items to rows.

#### `disabled?`

```tsx
disabled?: boolean
```

#### `data?`

```tsx
data?: object
```

Custom data that can be passed to the row.

> 🧠 This can be passed to rows to identify their type. This type can later be used in the event callbacks to apply different behaviors to different row types.

{% code title="Row.tsx" %}
```tsx
useRow({
  id: props.id,
  data: { type: "timeline-row" },
});
```
{% endcode %}

{% code title="Timeline.tsx" %}
```tsx
const onDragEnd = (event: DragEndEvent) => {
  const updatedRelevance =
    event.active.data.current.getRelevanceFromDragEvent?.(event);

  const rowType = event.active.data.current.type;

  if (rowType === "timeline-row") {
    // update item with id activeItemId with the updatedRelevance, or the updated row using overedId
  }
};
```
{% endcode %}

### API

{% hint style="info" %}
All of dnd-kit [useDroppable](https://docs.dndkit.com/api-documentation/droppable/usedroppable#properties) api are returned as well.
{% endhint %}

#### `rowWrapperStyle`

```tsx
rowWrapperStyle: CSSProperties;
```

Basic styles that must be applied to the row container element.

#### `rowStyle`

```tsx
rowStyle: CSSProperties;
```

Basic styles that must be applied to the row element.

#### `rowSidebarStyle`

```tsx
rowSidebarStyle: CSSProperties;
```

Basic styles that must be applied to the row sidebar element.

When `sidebarWidth` is provided to `TimelineContext`, this style will automatically include a matching `width` value, so no additional width styling is needed on the sidebar element.

#### `setSidebarRef`

```tsx
setSidebarRef: React.RefObject<HTMLDivElement>;
```

> **Deprecated.** Pass `sidebarWidth` as a prop to `TimelineContext` instead. Attaching this ref to every row's sidebar causes excessive re-renders.

A ref that can be passed to the sidebar element so the timeline can measure its width. Prefer the `sidebarWidth` prop on `TimelineContext` for a more performant alternative.
