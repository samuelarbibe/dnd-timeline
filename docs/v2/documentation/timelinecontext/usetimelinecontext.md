# useTimelineContext

This hooks can be used to access the timeline's state, and also provides a set of useful helper functions.

### API

#### `style`

```typescript
style: CSSProperties
```

A set of mendatory style properties, that must be applied to the timeline container element.

#### `timelineRef`

```typescript
timelineRef: React.MutableRefObject<HTMLElement | null>
```

The timeline container element's ref.

#### `setTimelineRef`

```typescript
setTimelineRef: (element: HTMLElement | null) => void
```

A ref setter that must be passed to the timeline's container element.

#### `valueToPixels`

```typescript
valueToPixels: (value: number) => number
```

A helper function that receives a value, and returns the pixel representation in relation to the timeline's container element.

> 🧠 It can be used to infer elements' size and position in pixels, based on their duration. It is internally used in order to position items on the timeline.

#### `pixelsToValue`

```typescript
pixelsToValue: (pixels: number) => number
```

A helper function that receives pixels, and returns the equivalent duration for it, in relation to the timeline's container element.

> 🧠 It can be used to convert size and position to a value. It is internally used to infer items' update spans according to their updated position/width, in relation to the timeline's container element.

#### `getValueFromScreenX`

```typescript
getValueFromScreenX: (screenX: number) => number
```

A helper function that receives x position in the client's screen, and returns a date representation of that position, in relation to the timeline's container element.

> 🧠 It can be used to infer a time value from a mouse event. For example, you can use it to extract a date from a click event on the timeline.

#### `getDeltaXFromScreenX`

```typescript
getDeltaXFromScreenX: (screenX: number) => number
```

A helper function that receives x position in the client's screen, and returns the delta X distance from the timeline's start.

> 🧠 It can be used to infer a relative position for a custom item from a mouse event. For example, you can use it to place a custom item on the timeline from a pointer event.&#x20;

#### `getSpanFromDragEvent`

```typescript
getSpanFromDragEvent: (event: DragEvent) => Span | null
```

A function that extracts span from a drag event. The drag event type can be one of the following:

{% code overflow="wrap" %}
```tsx
type DragEvent = DragStartEvent | DragEndEvent | DragCancelEvent | DragMoveEvent
```
{% endcode %}

This function is injected into all of dnd-kit's events, and allowes you to infer the dragged item's span from the event object. For example:

<pre class="language-tsx"><code class="lang-tsx">const onDragEnd = (event: DragEndEvent) => {
  const updatedSpan =
<strong>    event.active.data.current.getSpanFromDragEvent?.(event)
</strong>    
  // update your state using the updated span.
}
</code></pre>

#### `getSpanFromResizeEvent`

```typescript
getSpanFromResizeEvent: (event: ResizeEvent) => Span | null
```

A function that extracts span from a drag event. The drag event type can be one of the following:

{% code overflow="wrap" %}
```tsx
type ResizeEvent = ResizeStartEvent | ResizeMoveEvent | ResizeEndEvent
```
{% endcode %}

This function is injected into all of dnd-timeline's resize events, and allowes you to infer the dragged item's span from the event object. For example:

<pre class="language-tsx"><code class="lang-tsx">const onResizeEnd = (event: ResizeEndEvent) => {
  const updatedSpan =
<strong>    event.active.data.current.getSpanFromResizeEvent?.(event)
</strong>    
  // update your state using the updated span.
}
</code></pre>
