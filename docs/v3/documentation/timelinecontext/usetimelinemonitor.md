---
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/80Y6kfGWIGJve16WSQR3/documentation/timelinecontext/usetimelinemonitor
---

# useTimelineMonitor

This hook allows you to monitor drag and resize events that occur on the timeline. It serves as a unified interface for handling both `dnd-kit` drag events and `dnd-timeline` specific resize events.

### Usage

```tsx
import { useTimelineMonitor } from "dnd-timeline";

useTimelineMonitor({
  onDragStart: (event) => {
    console.log("Drag started", event);
  },
  onDragEnd: (event) => {
    console.log("Drag ended", event);
  },
  onResizeStart: (event) => {
    console.log("Resize started", event);
  },
  onResizeEnd: (event) => {
    console.log("Resize ended", event);
  },
});
```

### API

The hook accepts an object with the following optional callback functions:

#### Drag Events (from `@dnd-kit/core`)

* `onDragStart`: Called when a drag operation starts.
* `onDragMove`: Called when a draggable item is moved.
* `onDragOver`: Called when a draggable item is moved over a droppable container.
* `onDragEnd`: Called when a drag operation ends.
* `onDragCancel`: Called when a drag operation is cancelled.

#### Resize Events (specific to `dnd-timeline`)

* `onResizeStart`: Called when a resize operation starts.
* `onResizeMove`: Called when an item is being resized.
* `onResizeEnd`: Called when a resize operation ends.
