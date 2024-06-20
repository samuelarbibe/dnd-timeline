# Zoom & Pan

`dnd-timeline` provides a default interaction that works as following:

* `ctrl + scroll`: zoom in and out, biased by cursor position.
* `ctrl + shift + scroll`: pan right and left.

(`cmd` instead of `ctrl` on macOS)

`dnd-timeline` also allows you to override this behavior, and implement you own zoom/pan interaction.

You can do so by passing you custom pan strategy to the `usePanStrategy` prop on the `TimelineContext`.

{% content-ref url="../timelinecontext/" %}
[timelinecontext](../timelinecontext/)
{% endcontent-ref %}

## Custom Zoom & Pan Strategy

The pan strategy is a custom hook, that receives a ref to the timeline and a callback that should be called to trigger a zoom / pan action.

The hook is of the following structure:

```tsx
type UsePanStrategy = (
  timelineRef: React.MutableRefObject<HTMLElement | null>,
  onPanEnd: OnPanEnd
) => void

type OnPanEnd = (event: PanEndEvent) => void

type PanEndEvent = {
  clientX?: number
  clientY?: number
  deltaX: number
  deltaY: number
}
```

#### `deltaX`

The amount of pixels panned on the X axis. This will then be translated into symmetrical changes in the start and end of the timeline's timeframe.

For example, a `deltaX` will be translated into addition / subtraction of respective amount of milliseconds both in the `start` and `end` of the timeframe. `rtl` is taken into account.

`clientX` and `clientY` have no effect on this translation.

This will create the effect of panning right and left on the timeline.

#### `deltaY`

The amount of pixels scrolled on the Y axis. This will then be translated into **asymmetrical** changes in the `start` and `end` of the timeline's timeframe.

If `clientX` and `clientY` are **not** provided, a `deltaY` will be translated into **mirrored** addition / subtraction of respective amount of milliseconds both in the `start` and `end` of the timeframe.

If `clientX` and `clientY` are provided, a `deltaY` will be translated into similar changes to the start and end of the timeframe, but biased by the client's cursor position in relation to the timeline. If the client's cursor is closer to the end of the timeline, the zoom in/out will be directed towards it.

This will create the effect of zooming in and out of the timeline.

***

## Example

This is an example to the default strategy, `useWheelStrategy`:

<pre class="language-tsx" data-title="src/utils/panStrategies.ts"><code class="lang-tsx">export const useWheelStrategy: UsePanStrategy = (timelineRef, onPanEnd) => {
  useLayoutEffect(() => {
    const element = timelineRef?.current
    if (!element) returntax

    const wheelHandler = (event: WheelEvent) => {
      if (!event.ctrlKey &#x26;&#x26; !event.metaKey) return

      event.preventDefault()

      const isHorizontal = event.shiftKey

<strong>      const panEndEvent: PanEndEvent = {
</strong><strong>        clientX: event.clientX,
</strong><strong>        clientY: event.clientY,
</strong><strong>        deltaX: isHorizontal ? event.deltaX || event.deltaY : 0,
</strong><strong>        deltaY: isHorizontal ? 0 : event.deltaY,
</strong><strong>      }
</strong>
<strong>      onPanEnd(panEndEvent)
</strong>    }

    element.addEventListener('wheel', wheelHandler)

    return () => {
      element.removeEventListener('wheel', wheelHandler)
    }
  }, [onPanEnd, timelineRef])
}
</code></pre>
