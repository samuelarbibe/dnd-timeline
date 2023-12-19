# `dnd-timeline` [![npm version](https://badge.fury.io/js/dnd-timeline.svg)](https://npmjs.com/dnd-timeline)

# [Documentation](https://samuel-arbibe.gitbook.io/dnd-timeline/)

## dnd-timeline: A headless timeline library, based on [`dnd-kit`](https://docs.dndkit.com/)

- **Headless:** `dnd-timeline` is a headless-ui library, and contains 0 styling, aside from functional styling (position, z-index, etc.).
- **Hook-based:** exposes simple hooks like `useItem` and `useRow`, that should integrate seamlessly into your existing architecture.
- **Flexible:** very slim and flexible by design. `dnd-timeline` exposes utility functions and positional styling, and you can use them in conjunction with you favorite libraries - styling libraries (MUI, tailwindcss, ant-design, etc.), and functional libraries (react-virtual, framer-motion, etc.)
- **Based on [`dnd-kit`](https://docs.dndkit.com/):** all features exposed by the [`dnd-kit`](https://docs.dndkit.com/) library are applicable to dnd-timeline.
- **Performant:** renders only when needed. All the intermediate states and animations are done using css transformations, and require 0 re-renders.
- **RTL:** `dnd-timeline` nativly supports RTL. simply declare one of the parent divs as rtl with `dir="rtl"`, and thats it.

![2023-07-09 20 31 30](https://github.com/samuelarbibe/dnd-timeline/assets/38098325/d5be60a3-d06f-4950-8db6-ff78fffbce88)

## Installation

The library requires a single peer-dependency: react

To install it, run:

```sh
npm install react
```

Then, you can install the library itself:

```sh
npm install dnd-timeline
```

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

## Contribute

This project uses turborepo to manage the monorepo.

If you want to develop on your local machine, simply clone the project, and run

```sh
npm install
npm run dev
```

And all the examples will run on your local machine, likned to the local instance of the library.

Any changes made to the library will be reflected in the examples.
