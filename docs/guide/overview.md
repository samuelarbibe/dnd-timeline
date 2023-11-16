# Overview

`dnd-timeline` is a hook library, that provides you a few hooks and one context to build your own timeline.

Here are the different components and their role:

### `TimelineContext`

This context holds all the relevant state to manage a timeline. This context is also responsible wrapping you code with the [`DndContext`](https://docs.dndkit.com/api-documentation/context-provider) provided by `dnd-kit`

The context is also responsible for calling the callbacks you provide it, for the events that happen in the timeline.

The library is fully controlled, so you are responsible for managing state and state-updates.

### `useTimelineContext`

A hook to access different helper functions and the context's values. These helpers and values will help you customize you timeline.

### `useRow`

