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

## Props

```tsx
interface TimelineContextProps {
  timeframe: Timeframe; // { start: Date, end: Date }
  overlayed?: boolean;
  onResizeEnd: OnResizeEnd;
  onResizeMove?: OnResizeMove;
  onResizeStart?: OnResizeStart;
  usePanStrategy?: UsePanStrategy;
  onTimeframeChanged: OnTimeframeChanged;
  timeframeGridSizeDefinition?: number | GridSizeDefinition[];
  // ...DndContext Props
}
```

### Event Handlers

`dnd-timeline` is based on `dnd-kit`, so all `dnd-kit's` events and event handlers are also supported here, with a little addition:

Every handler is called with extra information regarding its relation to the timeline.&#x20;

For example, the `onDragEnd` event is called with extra data:

<pre class="language-tsx" data-overflow="wrap"><code class="lang-tsx">const onDragEnd = (event: DragEndEvent) => {
  const overedId = event.over?.id.toString()
  if (!overedId) return

  const activeItemId = event.active.id

  const updatedRelevance =
<strong>    event.active?.data?.current?.getRelevanceFromDragEvent(event)
</strong>    
  // update your state using the updated relevance.
}
</code></pre>

This is the same for all `dnd-kit` supported handlers:

- `onDragStart`
- `onDragEnd`
- `onDragMove`
- `onDragCancel`

{% hint style="info" %}
The type definitions for these functions can be viewed in [dnd-kit's documentation](https://docs.dndkit.com/api-documentation/context-provider#props)
{% endhint %}

`dnd-timeline` adds a set of 4 more handlers, to handle the resize event:

- `onResizeStart`
- `onResizeEnd`
- `onResizeMove`
- `onResizeCancel` (WIP)

These events act just like the `dnd-kit` event, except that the event looks a bit different:

```ts
type ResizeEvent = {
  active: Omit<Active, "rect">; // dnd-kit's Active type
  delta: {
    x: number;
  };
  direction: DragDirection; // 'start' | 'end'
};
```

The resize events' data also contain a `getRelevanceFromResizeEvent` that you can use to infer the updated relevance:

<pre class="language-tsx"><code class="lang-tsx">const onResizeEnd = (event: ResizeEndEvent) => {
  const updatedRelevance =
<strong>    event.active.data.current?.getRelevanceFromResizeEvent(event)
</strong>
  if (!updatedRelevance) return

  const activeItemId = event.active.id

  // update activeItemId's relevance with the updated relevance.
}
</code></pre>

We will later understand how these function are passed, and how you can manually pass them for custom interactions.

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

### Options

#### `timeframe`

```tsx
timeframe: Timeframe;
```

```tsx
type Timeframe = {
  start: Date;
  end: Date;
};
```

An object defining the viewable timeframe in the timeline. This field is fully controlled.

#### `onTimeframeChanged`

```tsx
onTimeframeChanged: OnTimeframeChanged;
```

```tsx
type OnTimeframeChanged = (
  updateFunction: (prev: Timeframe) => Timeframe,
) => void;
```

A callback that receives an update function as a prop. Use this to update your controlled state of `timeframe`.

#### `overlayed?`

```tsx
overlayed?: boolean = false
```

This prop enabled/disabled rendering of items when dragging. If using `dnd-kit`'s [DragOverlay](https://docs.dndkit.com/api-documentation/draggable/drag-overlay), this should be set to `true`.

#### `timeframeGridSizeDefinition?`

```tsx
timeframeGridSizeDefinition?: number | GridSizeDefinition[]
```

```tsx
type GridSizeDefinition = {
  value: number;
  maxTimeframeSize?: number;
};
```

Enables and configures snapping in the timeline.&#x20;

If provided with a number, the value will be the snap grid size in `milliseconds`.

If provided with an array of `GridSizeDefinition`, the snap grid size will be the `value` of the array member with the smallest matching `maxTimeframeSize`, in `milliseconds`.

> 🧠 To create a dynamic snap grid, that is based on the timeframe size, pass in an array of `GridSizeDefinition`.
>
> ```tsx
> const timeframeGridSize: GridSizeDefinition[] = [
>   {
>     value: hoursToMilliseconds(1),
>   },
>   {
>     value: minutesToMilliseconds(30),
>     maxTimeframeSize: hoursToMilliseconds(24),
>   },
> ];
> ```
>
> For example, the `timeframeGridSize` above will cause the timeframe to have a snap grid size of 30 minutes if timeframe size is smaller than 24 hours, otherwise the grid size will be 1 hour.

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

{% content-ref url="../zoom-and-pan.md" %}
[zoom-and-pan.md](../zoom-and-pan.md)
{% endcontent-ref %}

## Usage

You will need to wrap your timeline and all of its component in a `<TimelineContext>`

{% code title="App.tsx" overflow="wrap" %}

```tsx
function App() {
  const [rows, setRows] = useRows();
  const [items, setItems] = useItems();
  const [timeframe, setTimeframe] = useState(DEFAULT_TIMEFRAME);

  const onResizeEnd = useCallback(
    (event: ResizeEndEvent) => {
      const updatedRelevance =
        event.active.data.current?.getRelevanceFromResizeEvent?.(event);

      if (!updatedRelevance) return;

      const activeItemId = event.active.id;

      // Only update the changed item. This will cause only the changed items to re-render
      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== activeItemId) return item;

          return {
            ...item,
            relevance: updatedRelevance,
          };
        }),
      );
    },
    [setItems],
  );

  return (
    <TimelineContext
      onResizeEnd={onResizeEnd}
      timeframe={timeframe}
      onTimeframeChanged={setTimeframe}
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
