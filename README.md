# Overview

## A headless timeline library, based on [`dnd-kit`](https://docs.dndkit.com/)

- **Headless:** `dnd-timeline` is a headless-ui library, and contains 0 styling, aside from functional styling (position, z-index, etc.).
- **Hook-based:** exposes simple hooks like `useItem` and `useRow`, that should integrate seamlessly into your existing architecture.
- **Flexible:** very slim and flexible by design. `dnd-timeline` exposes utility functions and positional styling, and you can use them in conjunction with you favorite libraries - styling libraries (MUI, tailwindcss, ant-design, etc.), and functional libraries (react-virtual, framer-motion, etc.)
- **Based on [`dnd-kit`](https://docs.dndkit.com/):** all features exposed by the [`dnd-kit`](https://docs.dndkit.com/) library are applicable to dnd-timeline.
- **Performence:** renders only when needed. All the intermediate states and animations are done using css transformations, and require 0 re-renders.
- **RTL support:** `dnd-timeline` nativly supports RTL. simply declare one of the parent divs as rtl with `dir="rtl"`, and thats it.

## Features

- **Stacked rows:** Items whose relevance's intersect are stacked on top of each other inside the same row.
- **Snap to Grid:** Items snap into a pre-defined grid when dropped, that can be changed according to zoom level.
- **Time Axis:** An optional time axis can be displayed, with different markers according to zoom level.
- **Time Cursor:** An optional time cursor indicating the current time on top of the timeline.
- **Pan and zoom:** You can zoom by holding <kbd>Ctrl</kbd> and scrolling using the mouse wheel, and pan by holding <kbd>Ctrl + Shift</kbd> scrolling using the mouse wheel.
- **Dynamically disabled rows and items:** Items and Rows can be disabled according to a client-defined logic.
- **Integration with external DnD:** The timeline can be used in conjunction with other DnD interactions in you app, to drag items into and outside of the timeline.

![2023-06-24 12 21 52](https://github.com/samuelarbibe/dnd-timeline/assets/38098325/98ec3d4a-df73-4766-8be3-4b3347c65658)
