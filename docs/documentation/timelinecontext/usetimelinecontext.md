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

#### `millisecondsToPixels`

```typescript
millisecondsToPixels: (milliseconds: number) => number
```

A helper function that receives milliseconds, and returns the pixel representation in relation to the timeline's container element.&#x20;

> 🧠 It can be used to infer elements' size and position in pixels, based on their duration. It is internally used in order to position items on the timeline.

#### `pixelsToMilliseconds`

```typescript
pixelsToMilliseconds: (pixels: number) => number
```

A helper function that receives pixels, and returns the equivalent duration for it in milliseconds, in relation to the timeline's container element.

> 🧠 It can be used to convert size and position to a time value. It is internally used to infer items' update relevances according to their updated position/width, in relation to the timeline's container element.

#### `getDateFromScreenX`

```typescript
getDateFromScreenX: (screenX: number) => Date
```

A helper function that x position in the client's screen, and returns a date represenation of that position, in relation to the timeline's container element.

> 🧠 It can be used to infer a time value from a mouse event. For example, you can use it to extract a date from a click event on the timeline.

#### `getRelevanceFromDragEvent`

```typescript
getRelevanceFromDragEvent: (event: DragEvent) => Relevance | null
```

A function that extracts relevance from a drag event. The drag event type can be one of the following:

{% code overflow="wrap" %}
```tsx
type DragEvent = DragStartEvent | DragEndEvent | DragCancelEvent | DragMoveEvent
```
{% endcode %}

This function is injected into all the drag events, and allowes you to infer the dragged item's relevance from the event object. For example:

<pre class="language-tsx"><code class="lang-tsx">const onDragEnd = (event: DragEndEvent) => {
  const updatedRelevance =
<strong>    event.active.data.current.getRelevanceFromDragEvent(event)
</strong>    
  // update your state using the updated relevance.
}
</code></pre>

#### `getRelevanceFromResizeEvent`

```typescript
getRelevanceFromResizeEvent: (event: ResizeEvent) => Relevance | null
```

A function that extracts relevance from a drag event. The drag event type can be one of the following:

{% code overflow="wrap" %}
```tsx
type ResizeEvent = ResizeStartEvent | ResizeMoveEvent | ResizeEndEvent
```
{% endcode %}

This function is injected into all of the resize events, and allowes you to infer the dragged item's relevance from the event object. For example:

<pre class="language-tsx"><code class="lang-tsx">const onResizeEnd = (event: ResizeEndEvent) => {
  const updatedRelevance =
<strong>    event.active.data.current.getRelevanceFromResizeEvent(event)
</strong>    
  // update your state using the updated relevance.
}
</code></pre>

&#x20;
