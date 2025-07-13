# Examples

{% hint style="info" %}
Only a small part of the examples are hosted.

The reset of the examples are in the repository, check it out: [https://github.com/samuelarbibe/dnd-timeline/tree/main/examples](https://github.com/samuelarbibe/dnd-timeline/tree/main/examples)
{% endhint %}

## Virtual

This examples uses [`@tanstack/react-virtual`](https://tanstack.com/virtual/v3) to create a virtualized list. This means that only the viewable rows will be rendered.

You can implement virtuallization with any library you want.

This approach is highly recommended, as it vastly improves performance for large datasets.

In this example, **1000 items and 1000 rows** are rendered, and eveything still runs very smoothly.

{% embed url="https://dnd-timeline-virtual.vercel.app" %}

## Sortable

This example uses `@dnd-kit`'s [Sortable](https://docs.dndkit.com/presets/sortable) preset to allow re-ordering of rows by dragging and dropping.

This shows simple integration of internal drag-and-drop interactions.

{% embed url="https://dnd-timeline-sortable.vercel.app" %}

## External

This example uses `@dnd-kit`'s [Draggable](https://docs.dndkit.com/api-documentation/draggable) and [Droppable](https://docs.dndkit.com/api-documentation/droppable) to enable dragging and dropping from an external location into the timeline.

You can also apply a policy to what can be dragged where by dynamically disabling unhallowed rows.

Just like this example, you can implement a couple other things:

* Dragging and Dropping items from the timeline to an external droppable
* Dragging and Dropping items from one timeline to another

And any other drag-and-drop interaction you can think of.

{% embed url="https://dnd-timeline-external.vercel.app" %}

## Time Axis

This examples adds a time axis and time cursor to indicate the current time and the range represented in the timeline.

These components are external to the library, and are an example of how to use `dnd-timeline`'s context to create custom components.

{% embed url="https://dnd-timeline-timeaxis.vercel.app" %}

## Performance

This example adds a `debounce` or a `throttle` mechanism to the range, in order to greatly improve the zoom and pan performance.

Play around with the different options to see how they feel!

{% embed url="https://dnd-timeline-performance.vercel.app" %}

## Drag to Create

This example adds the ability to create a new item by dragging it on a row. Simply click on a row, move to a certain size, and release to create an item of that size, on the row.

{% embed url="https://dnd-timeline-create.vercel.app" %}

## Multi Select

In dnd-kit, multi-select is not officially supported, an reuires work-arounds.\
This example implements a simple workaround, that allows selecting items by clicking them, and them dragging all of them at once. \
\
In this example, all items are moved relative to their initial position.

{% embed url="https://dnd-timeline-multi.vercel.app" %}
