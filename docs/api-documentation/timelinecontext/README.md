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

### Props

```tsx
interface TimelineContextProps {
    timeframe: Timeframe // { start: Date, end: Date }
    overlayed?: boolean
    onResizeEnd: OnResizeEnd
    onResizeMove?: OnResizeMove
    onResizeStart?: OnResizeStart
    onTimeframeChanged: OnTimeframeChanged
    timeframeGridSize?: number | GridSizeDefinition[]
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

This is true for all `dnd-kit` supported handlers:

* `onDragStart`
* `onDragEnd`
* `onDragMove`
* `onDragCancel`

{% hint style="info" %}
The type definitions for these functions can be viewed in [dnd-kit's documentation](https://docs.dndkit.com/api-documentation/context-provider#props)
{% endhint %}

`dnd-timeline` adds a set of 4 more handlers, to handle the resize event:

* `onResizeStart`
* `onResizeEnd`
* `onResizeMove`
* `onResizeCancel` (WIP)

These events act just like the `dnd-kit` event, except that the event looks a bit different:

```ts
type ResizeEvent = {
  active: Omit<Active, 'rect'> // dnd-kit's Active type
  delta: {
    x: number
  }
  direction: DragDirection // 'start' | 'end'
}
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
