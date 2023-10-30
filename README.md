# `dnd-timeline` [![npm version](https://badge.fury.io/js/dnd-timeline.svg)](https://npmjs.com/dnd-timeline)  

### [Example Implementation](https://github.com/samuelarbibe/timeline)  
  
### [Storybook](http://main--6496bc4344e173caa1c38272.chromatic.com/?path=/docs/stories-overview--docs)


#### A headless timeline library, based on [`dnd-kit`](https://docs.dndkit.com/)

- **Headless:** `dnd-timeline` is a headless-ui library, and contains 0 styling, aside from functional styling (position, z-index, etc.).
- **Hook-based:** exposes simple hooks like `useItem` and `useRow`, that should integrate seamlessly into your existing architecture.
- **Flexible:** very slim and flexible by design. `dnd-timeline` exposes utility functions and positional styling, and you can use them in conjunction with you favorite libraries - styling libraries (MUI, tailwindcss, ant-design, etc.), and functional libraries (react-virtual, framer-motion, etc.)
- **Based on [`dnd-kit`](https://docs.dndkit.com/):** all features exposed by the [`dnd-kit`](https://docs.dndkit.com/) library are applicable to dnd-timeline.
- **Performant:** renders only when needed. All the intermediate states and animations are done using css transformations, and require 0 re-renders.
- **RTL:** `dnd-timeline` nativly supports RTL. simply declare one of the parent divs as rtl with `dir="rtl"`, and thats it.
  
![2023-07-09 20 31 30](https://github.com/samuelarbibe/dnd-timeline/assets/38098325/d5be60a3-d06f-4950-8db6-ff78fffbce88)

## Features

- **Stacked rows:** Items whose relevance's intersect are stacked on top of each other inside the same row.
- **Snap to Grid:** Items snap into a pre-defined grid when dropped, that can be changed according to zoom level.
- **Time Axis:** An optional time axis can be displayed, with different markers according to zoom level.
- **Time Cursor:** An optional time cursor indicating the current time on top of the timeline.
- **Pan and zoom:** You can zoom by holding <kbd>Ctrl</kbd> and scrolling using the mouse wheel, and pan by holding <kbd>Ctrl + Shift</kbd> scrolling using the mouse wheel.
  ![2023-07-09 20 27 50](https://github.com/samuelarbibe/dnd-timeline/assets/38098325/b94f870b-5d32-4099-92f7-a1a236dbf7b1)
- **Dynamically disabled rows and items:** Items and Rows can be disabled according to a client-defined logic.
  ![2023-07-09 20 29 15](https://github.com/samuelarbibe/dnd-timeline/assets/38098325/a21f3afc-d075-448a-8fb7-fb445351b9f5)
- **Integration with external DnD:** The timeline can be used in conjunction with other DnD interactions in you app, to drag items into and outside of the timeline.
  ![2023-07-09 20 30 25](https://github.com/samuelarbibe/dnd-timeline/assets/38098325/bd354d06-415a-4561-9476-1b9b8463cdd1)

## How does it work?

`dnd-timeline` uses the `data` field provided on `dnd-kit`'s `useDraggable` hook, to forward date utils to your event handlers.  
The `TimelineContext` also exposes a `TimelineBag` object, which incudes a set of helpers to work with the timeline.

In order to handle a change in an item's relevance, all you need to do is to handle the `onDragEnd` event, and use the provided helper to infer the updated item relevance:

```tsx
const onDragEnd = (event: DragEndEvent) => {
  const overedId = event.over?.id.toString()
  if (!overedId) return

  const activeItemId = event.active.id

  const getRelevanceFromDragEvent =
    event.active?.data?.current?.getRelevanceFromDragEvent

  const updatedRelevance = getRelevanceFromDragEvent(event)

  // update item with id activeItemId with the updatedRelevance, or the updated row using overedId
}
```

This is true for all `dnd-kit` supported handlers:

- `onDragStart`
- `onDragEnd`
- `onDragMove`
- `onDragCancel`

`dnd-timeline` adds a set of 4 more handlers, to handle the resize event:

- `onResizeStart` (WIP)
- `onResizeEnd`
- `onResizeMove` (WIP)
- `onResizeCancel` (WIP)

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

The resize events' data already contains the updated relevance.

```tsx
const onResizeEnd = (event: ResizeEndEvent) => {
  const updatedRelevance = event.active.data.current?.relevance
  if (!updatedRelevance) return

  const activeItemId = event.active.id

  // update activeItemId's relevance with the updatedRelevance
}
```

### External items

To handle external items, you will need to pass the dnd-timeline's helpers when defining your draggabale items:

```tsx
const { getRelevanceFromDragEvent, millisecondsToPixels } = useTimelineContext()

const { attributes, isDragging, listeners, setNodeRef, transform, transition } =
  useItem({
    id: props.id,
    disabled: props.disabled,
    data: {
      getRelevanceFromDragEvent,
      duration: props.duration, // the getRelevanceFromDragEvent also knows how to handle duration
    },
  })
```

For non-timeline items, like an external item, you will need to provide a `duration` field describing the items duration in milliseconds.  
`dnd-timeline` will use it to infer its location in the timeline when dropped in and pass it through the event for you to add a new timeline item.
