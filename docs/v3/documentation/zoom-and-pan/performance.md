---
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/80Y6kfGWIGJve16WSQR3/documentation/zoom-and-pan/performance
---

# Performance

Whenever the `range` changes, a recalculation of all the item's width and position must be performed.

When performing operations that require a high amount of sequential changes, like zooming in or panning, the resulted re-renders might cause stuttering and frame-drops.

This **"frequent change"** problem is quite common in reactive frontend applications, and there are multiple solutions to it.

As you are in full control of the `range` state, you can apply a chosen mechanism of debouncing to the `range` state.

This will reduce the amount changes registered in the timeline, and in return reduce the amount of renders required when zooming an panning, resulting in a great improvement in performance.

Here are some common solutions:

{% tabs %}
{% tab title="Deferring ⭐️" %}
If you use **React 18+**, you should make use of the [`useDeferredValue`](https://react.dev/reference/react/useDeferredValue) API.

> `useDeferredValue` is a React Hook that lets you defer updating a part of the UI.

#### Code Example

{% tabs %}
{% tab title="App.tsx" %}
<pre class="language-tsx"><code class="lang-tsx">function App() {
  const [range, setRange] = useState(DEFAULT_TIMEFRAME);
<strong>  const debouncedRange = useDeferredValue(range);
</strong>  
  ...
  
  return (
    &#x3C;TimelineContext
        onDragEnd={onDragEnd}
        onResizeEnd={onResizeEnd}
<strong>        range={debouncedRange} // provide the debounced range
</strong>        onRangeChanged={setRange}
    >
      &#x3C;Timeline items={items} rows={rows} />
    &#x3C;/TimelineContext>
  )
</code></pre>
{% endtab %}

{% tab title="Item.tsx" %}
<pre class="language-tsx"><code class="lang-tsx">function Item(props: ItemProps) {
  ...
  const style: CSSProperties = {
    ...itemStyle,
<strong>    transition: 'left .2s linear, width .2s linear', 
</strong><strong>    // You can a CSS transition to make the debounce feel smoother
</strong>  }

  return (
    &#x3C;div ref={setNodeRef} style={style} {...listeners} {...attributes}>
    ...
    &#x3C;/div>
  )
}
</code></pre>
{% endtab %}
{% endtabs %}
{% endtab %}

{% tab title="Throttle" %}
Another common solution is **throttling.**

> Throttling limits the rate of function calls. It guarantees that a function is only executed once within a set time interval. If the function is called multiple times during that interval, only the first call is executed. Subsequent calls are ignored until the interval has elapsed.

#### Code Example

{% tabs %}
{% tab title="App.tsx" %}
<pre class="language-tsx"><code class="lang-tsx">function App() {
  const [range, setRange] = useState(DEFAULT_TIMEFRAME);
<strong>  const debouncedRange = useThrottle(range, 300);
</strong>  
  ...
  
  return (
    &#x3C;TimelineContext
        onDragEnd={onDragEnd}
        onResizeEnd={onResizeEnd}
<strong>        range={debouncedRange} // provide the debounced range
</strong>        onRangeChanged={setRange}
    >
      &#x3C;Timeline items={items} rows={rows} />
    &#x3C;/TimelineContext>
  )
</code></pre>
{% endtab %}

{% tab title="Item.tsx" %}
<pre class="language-tsx"><code class="lang-tsx">function Item(props: ItemProps) {
  ...
  const style: CSSProperties = {
    ...itemStyle,
<strong>    transition: 'left .2s linear, width .2s linear', 
</strong><strong>    // You can a CSS transition to make the debounce feel smoother
</strong>  }

  return (
    &#x3C;div ref={setNodeRef} style={style} {...listeners} {...attributes}>
    ...
    &#x3C;/div>
  )
}
</code></pre>
{% endtab %}

{% tab title="useThrottle.tsx" %}
```tsx
export function useThrottle<T>(value: T, interval = 500) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastUpdated = useRef<number | null>(null);

  useEffect(() => {
    const now = Date.now();

    if (lastUpdated.current && now >= lastUpdated.current + interval) {
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      const id = window.setTimeout(() => {
        lastUpdated.current = now;
        setThrottledValue(value);
      }, interval);

      return () => {
        window.clearTimeout(id)
      };
    }
  }, [value, interval]);

  return throttledValue;
}
```
{% endtab %}
{% endtabs %}
{% endtab %}

{% tab title="Debounce" %}
The most common way to solve this is using **debounce.**

> Debouncing prevents extra activations or slow functions from triggering too often. It will wait for a given interval to elapse since the last change, and only then apply it.

#### Code Example

{% tabs %}
{% tab title="App.tsx" %}
<pre class="language-tsx"><code class="lang-tsx">function App() {
  const [range, setRange] = useState(DEFAULT_TIMEFRAME);
<strong>  const debouncedRange = useDebounce(range, 300)
</strong>  
  ...
  
  return (
    &#x3C;TimelineContext
        onDragEnd={onDragEnd}
        onResizeEnd={onResizeEnd}
<strong>        range={debouncedRange} // provide the debounced range
</strong>        onRangeChanged={setRange}
    >
      &#x3C;Timeline items={items} rows={rows} />
    &#x3C;/TimelineContext>
  )
</code></pre>
{% endtab %}

{% tab title="Item.tsx" %}
<pre class="language-tsx"><code class="lang-tsx">function Item(props: ItemProps) {
  ...
  const style: CSSProperties = {
    ...itemStyle,
<strong>    transition: 'left .2s linear, width .2s linear', 
</strong><strong>    // You can a CSS transition to make the debounce feel smoother
</strong>  }

  return (
    &#x3C;div ref={setNodeRef} style={style} {...listeners} {...attributes}>
    ...
    &#x3C;/div>
  )
}
</code></pre>
{% endtab %}

{% tab title="useDebounce.tsx" %}
```tsx
export function useDebounce<T>(value: T, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```
{% endtab %}
{% endtabs %}
{% endtab %}
{% endtabs %}

> 🧠 You can still make use of the un-debounced state to render selected components in real-time. For example, you can render the time-axis using the un-debounced state, and render the timeline using the debounced state.
>
> Play around with the live demo, and watch how the timeaxis and the range move asynchronously🔥

### Live Example

In this example, You can play around with difference modes and feel the difference between them.

[Click here to see the full code](../../../../examples/performance/src/App.tsx)

{% embed url="https://dnd-timeline-performance.vercel.app" %}
