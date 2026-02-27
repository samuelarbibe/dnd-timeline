---
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/80Y6kfGWIGJve16WSQR3/documentation/timelinecontext
---

# TimelineContext

This context holds all the relevant state to manage a timeline. This context is also responsible wrapping you code with the [`DndContext`](https://docs.dndkit.com/api-documentation/context-provider) provided by `dnd-kit`

The context is also responsible for calling the callbacks you provide it, for the events that happen in the timeline.

The library is fully controlled, so you are responsible for managing state and state-updates.

{% hint style="info" %}
You timeline components must be wrapped in this context.
{% endhint %}

<pre class="language-tsx" data-full-width="false"><code class="lang-tsx">function App() {
    return (
<strong>        &#x3C;TimelineContext>
</strong>            // You code here
<strong>        &#x3C;/TimelineContext>
</strong>    )
}
</code></pre>

## Usage

You will need to wrap your timeline and all of its component in a `<TimelineContext>`

{% code title="App.tsx" overflow="wrap" %}

```tsx
function App() {
  const [rows, setRows] = useRows();
  const [items, setItems] = useItems();
  const [range, setRange] = useState(DEFAULT_TIMEFRAME);

  const onResizeEnd = useCallback((event: ResizeEndEvent) => {
    const updatedSpan =
      event.active.data.current.getSpanFromResizeEvent?.(event);

    if (!updatedSpan) return;

    const activeItemId = event.active.id;

    // Only update the changed item. This will cause only the changed items to re-render
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== activeItemId) return item;

        return {
          ...item,
          span: updatedSpan,
        };
      }),
    );
  }, []);

  return (
    <TimelineContext
      onResizeEnd={onResizeEnd}
      range={range}
      onRangeChanged={setRange}
      sidebarWidth={200}
    >
      <Timeline rows={rows} items={items} />
    </TimelineContext>
  );
}
```

{% endcode %}

You will need to create a `<Timeline />` component to use the useTimelineContext inside of it.

{% code title="Timeline.tsx" %}

```tsx
function Timeline(props: TimelineProps){
  const { setTimelineRef, style } = useTimelineContext()

  return (
    <div ref={setTimelineRef} style={style}>
      {props.rows.map((row) =>
        // Render rows here...
      )}
    </div>
  )
}
```

{% endcode %}

You can learn how to render rows here:

{% content-ref url="../row/" %}
[row](../row/)
{% endcontent-ref %}

---

## Props

```tsx
interface TimelineContextProps {
  range: Range; // { start: number, end: number }
  overlayed?: boolean;
  onResizeEnd: OnResizeEnd;
  onResizeMove?: OnResizeMove;
  onResizeStart?: OnResizeStart;
  usePanStrategy?: UsePanStrategy;
  onRangeChanged: OnRangeChanged;
  rangeGridSizeDefinition?: number | GridSizeDefinition[];
  sidebarWidth: number;
  // ...DndContext Props
}
```

### Event Handlers

`dnd-timeline` is based on `dnd-kit`, so all `dnd-kit's` events and event handlers are also supported here, with a little addition:

Every handler is called with extra information regarding its relation to the timeline.

For example, the `onDragEnd` event is called with extra data:

<pre class="language-tsx" data-overflow="wrap"><code class="lang-tsx">const onDragEnd = (event: DragEndEvent) => {
  const overedId = event.over?.id.toString()
  if (!overedId) return

  const activeItemId = event.active.id

<strong>  const updatedSpan =
</strong><strong>    event.active.data.current.getSpanFromDragEvent?.(event)
</strong>
  // update your state using the updated span.
}
</code></pre>

Every event contains a helper function that can be used to infer the item's updated span.

{% hint style="warning" %}
Do not try to calculate the item's updated span on your own. You should call the `getSpanFromDragEvent` or `getSpanFromResizeEvent` to get the updated span right before using it to update you own state.
{% endhint %}

#### `onDragStart? | onDragEnd? | onDragMove? | onDragCancel?`

{% embed url="https://docs.dndkit.com/api-documentation/context-provider#event-handlers" %}
Click to see dnd-kit's documentation on these event callbacks.
{% endembed %}

The only difference is that the `getSpanFromDragEvent` function is added to the `data` of the event's active node.

#### `onResizeStart?`

```tsx
onResizeMove?: (event: ResizeStartEvent) => void
```

```tsx
type ResizeStartEvent = {
  active: Omit<Active, "rect">;
  direction: DragDirection; // 'start' | 'end'
};
```

The `active` object contains the item's custom data, alongside a `getSpanFromDragEvent` function that should be called with the event to get the updated span.

#### `onResizeMove?`

```tsx
onResizeMove?: (event: ResizeMoveEvent) => void
```

```tsx
type ResizeMoveEvent = {
  active: Omit<Active, "rect">;
  delta: {
    x: number;
  };
  direction: DragDirection; // 'start' | 'end'
};
```

The `active` object contains the item's custom data, alongside a `getSpanFromResizeEvent` function that should be called with the event to get the updated span.

#### `onResizeEnd?`

```tsx
onResizeMove?: (event: ResizeEndEvent) => void
```

```tsx
type ResizeEndEvent = {
  active: Omit<Active, "rect">;
  delta: {
    x: number;
  };
  direction: DragDirection; // 'start' | 'end'
};
```

The `active` object contains the item's custom data, alongside a `getSpanFromResizeEvent` function that should be called with the event to get the updated span.

---

### Options

#### `range`

```tsx
range: Range;
```

```tsx
type Range = {
  start: number;
  end: number;
};
```

An object defining the viewable range in the timeline. This field is fully controlled.

#### `onRangeChanged`

```tsx
onRangeChanged: OnRangeChanged;
```

```tsx
type OnRangeChanged = (updateFunction: (prev: Range) => Range) => void;
```

A callback that receives an update function as a prop. Use this to update your controlled state of `range`.

#### `overlayed?`

```tsx
overlayed?: boolean = false
```

This prop enabled/disabled rendering of items when dragging. If using `dnd-kit`'s [DragOverlay](https://docs.dndkit.com/api-documentation/draggable/drag-overlay), this should be set to `true`.

#### `rangeGridSizeDefinition?`

```tsx
rangeGridSizeDefinition?: number | GridSizeDefinition[]
```

```tsx
type GridSizeDefinition = {
  value: number;
  maxRangeSize?: number;
};
```

Enables and configures snapping in the timeline.

If provided with a number, the value will be the snap grid size.

If provided with an array of `GridSizeDefinition`, the snap grid size will be the `value` of the array member with the smallest matching `maxRangeSize`.

> 🧠 To create a dynamic snap grid, that is based on the range size, pass in an array of `GridSizeDefinition`.
>
> ```tsx
> const rangeGridSize: GridSizeDefinition[] = [
>   {
>     value: hoursToMilliseconds(1),
>   },
>   {
>     value: minutesToMilliseconds(30),
>     maxRangeSize: hoursToMilliseconds(24),
>   },
> ];
> ```
>
> For example, the `rangeGridSize` above will cause the range to have a snap grid size of 30 minutes if range size is smaller than 24 hours, otherwise the grid size will be 1 hour.

#### `usePanStrategy?`

```tsx
usePanStrategy?: UsePanStrategy = useWheelStrategy
```

```tsx
type UsePanStrategy = (
  timelineRef: React.MutableRefObject<HTMLElement | null>,
  onPanEnd: OnPanEnd,
) => void;

type OnPanEnd = (event: PanEndEvent) => void;

type PanEndEvent = {
  clientX?: number;
  clientY?: number;
  deltaX: number;
  deltaY: number;
};
```

Enables and configures panning and zooming the timeline.

The default strategy is the `useWheelStrategy`, which uses `ctrl + wheel` to zoom in and out, and `shift + ctrl + wheel` to pan left and right (`cmd/ctrl` on MacOS).

{% content-ref url="../zoom-and-pan/" %}
[zoom-and-pan](../zoom-and-pan/)
{% endcontent-ref %}

#### `sidebarWidth`

```tsx
sidebarWidth: number;
```

The sidebar width in pixels. The timeline uses this value to calculate item positions and viewport width, and to set the `width` style on `rowSidebarStyle` returned from `useRow`.

```tsx
<TimelineContext
  sidebarWidth={200}
  onResizeEnd={onResizeEnd}
  range={range}
  onRangeChanged={setRange}
>
  <Timeline rows={rows} items={items} />
</TimelineContext>
```

#### `resizeHandleWidth?` <a href="#resizehandlewidth" id="resizehandlewidth"></a>

```tsx
resizeHandleWidth?: number = 20
```

The resize handle width, in pixels. Choosing a larger or a smaller `handleWidth` will change the resize action's sensitivity.\
Can be overwritten per item, using the same prop on `useItem`.

{% hint style="info" %}
**If set to `0`, resizing will be disabled.**
{% endhint %}
