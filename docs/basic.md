# Examples

{% hint style="info" %}
The code of these examples is included in the repository.

Check it out: [https://github.com/samuelarbibe/dnd-timeline/tree/main/examples](https://github.com/samuelarbibe/dnd-timeline/tree/main/examples)
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
