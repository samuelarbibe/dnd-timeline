# Zoom & Pan

`dnd-timeline` provides a default interaction that works as following:

* `ctrl + scroll`: zoom in and out, biased by cursor position.
* `ctrl + shift + scroll`: pan right and left.

(`cmd` instead of `ctrl` on macOS)

`dnd-timeline` also allows you to override this behavior, and implement you own zoom/pan interaction.

You can do so by passing you custom pan strategy to the `usePanStrategy` prop on the `TimelineContext`.

dnd-timeline arrives with 2 existing strategies can use:

1. **`useWheelStrategy`** - This is the default strategy. works as described above.
2. **`useDragStrategy`  -** Allows moving the timeframe by dragging on the timeline's surface.

{% content-ref url="../timelinecontext/usetimelinecontext.md" %}
[usetimelinecontext.md](../timelinecontext/usetimelinecontext.md)
{% endcontent-ref %}

## Custom Zoom & Pan Strategy

The pan strategy is a custom hook, that receives a ref to the timeline and a callback that should be called to trigger a zoom / pan action.

The hook is of the following structure:

```tsx
type UsePanStrategy = (
    timelineBag: TimelineBag,
    onPanEnd: OnPanEnd,
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

The amount of pixels panned on the X axis. This will then be translated into symmetrical changes in the start and end of the timeline's range.

For example, a `deltaX` will be translated into addition / subtraction of respective amount of value both in the `start` and `end` of the range. `rtl` is taken into account.

`clientX` and `clientY` have no effect on this translation.

This will create the effect of panning right and left on the timeline.

#### `deltaY`

The amount of pixels scrolled on the Y axis. This will then be translated into **asymmetrical** changes in the `start` and `end` of the timeline's range.

If `clientX` and `clientY` are **not** provided, a `deltaY` will be translated into **mirrored** addition / subtraction of respective amount of value both in the `start` and `end` of the range.

If `clientX` and `clientY` are provided, a `deltaY` will be translated into similar changes to the start and end of the range, but biased by the client's cursor position in relation to the timeline. If the client's cursor is closer to the end of the timeline, the zoom in/out will be directed towards it.

This will create the effect of zooming in and out of the timeline.

***

## Example

This is an example to the default strategy, `useWheelStrategy`:

{% code title="src/utils/panStrategies.ts" fullWidth="true" %}
```tsx
export const useWheelStrategy: UsePanStrategy = (timelineBag, onPanEnd) => {
	useLayoutEffect(() => {
		const element = timelineBag.timelineRef.current;
		if (!element) return;

		const pointerWheelHandler = (event: WheelEvent) => {
			if (!event.ctrlKey && !event.metaKey) return;

			event.preventDefault();

			const isHorizontal = event.shiftKey;

			const panEndEvent: PanEndEvent = {
				clientX: event.clientX,
				clientY: event.clientY,
				deltaX: isHorizontal ? event.deltaX || event.deltaY : 0,
				deltaY: isHorizontal ? 0 : event.deltaY,
			};

			onPanEnd(panEndEvent);
		};

		element.addEventListener("wheel", pointerWheelHandler, { passive: false });

		return () => {
			element.removeEventListener("wheel", pointerWheelHandler);
		};
	}, [onPanEnd, timelineBag.timelineRef]);
};
```
{% endcode %}
