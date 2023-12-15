# Subrow

When you have two or more items who's relevance's intersect, you would expect them to stack on top of each other.

Each item in that stack should be rendered inside a subrow of some kind, that will seprate stacked items into different containers inside the same row.

`dnd-timeline` does not have this behaviour by default, but provides you with a simple util to help you stack.

<pre class="language-tsx" data-title="Timeline.tsx"><code class="lang-tsx">function Timeline(props: TimelineProps) {  
  const { setTimelineRef, style, timeframe } = useTimelineContext()

  const groupedSubrows = useMemo(
<strong>    () => groupItemsToSubrows(items, timeframe),
</strong>    [items, timeframe]
  )

  return (
    &#x3C;div ref={setTimelineRef} style={style}>
      {props.rows.map((row) => 
        &#x3C;Row key={row.id} id={row.id} sidebar={&#x3C;Sidebar row={row} />}>
          {groupedSubrows[row.id]?.map((subrow, index) => 
            &#x3C;div key={`${row.id}-${index}`}>
              {subrow.map((item) => 
                // Render item here...
              )}
            &#x3C;/div>
          )}
        &#x3C;/Row>
      )}
    &#x3C;/div>
  )
}
</code></pre>

{% hint style="info" %}
You might need to apply some basic CSS to the subrow element for it to work.

settings the properties:

```css
position: relative;
height: 50px; // replace with your own row height
```

should be enough, but it depends on your implementation.
{% endhint %}

### `groupItemsToSubrows`

A helper function to group intersecting items of the same row into different subrows.

The function receives and returns items of a certain type. If your items are of a different shape, you have to solutions:

1. Serialize and deserialize you own items into and out of this type.&#x20;
2. Implement you own helper function. The code is pretty simple, and available [here](../../../src/utils/groupItems.ts) for you.

### API

```tsx
groupItemsToSubrows: (items: ItemDefinition[], timeframe?: Relevance) =>
  Record<string, ItemDefinition[][]>;
```

The function returns an object where the key is a `rowId`, and the value is a matrix of items, where the first index is the subrow index, and the second index the the index of an item inside of that subrow.&#x20;

### Props

#### `items`

```tsx
items: ItemDefinition[]
```

An array of items in the shape of `ItemDefinition`

```tsx
type ItemDefinition = {
  id: string;
  rowId: string;
  relevance: Relevance;
  disabled?: boolean;
};
```

#### `timeframe?`

```tsx
timeframe?: Relevance
```

An optional timeframe object to filter out items that do not intersect with the current timeframe. This is to reduce the amount of items rendered at a time.
