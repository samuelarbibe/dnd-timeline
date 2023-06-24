# Overview

## A headless gantt library, based on [`dnd-kit`](https://docs.dndkit.com/)

- **Headless:** `react-gantt` is a headless-ui library, and contains 0 styling, aside from functional styling (position, z-index, etc.).
- **Hook-based:** exposes simple hooks like `useItem` and `useRow`, that should integrate seamlessly into your existing architecture.
- **Flexible:** very slim and flexible by design. `react-gantt` exposes utility functions and positional styling, and you can use them in conjunction with you favorite libraries - styling libraries (MUI, tailwindcss, ant-design, etc.), and functional libraries (react-virtual, framer-motion, etc.)
- **Based on [`dnd-kit`](https://docs.dndkit.com/):** all features exposed by the [`dnd-kit`](https://docs.dndkit.com/) library are applicable to react-gantt.
- **Performence:** renders only when needed. All the intermediate states and animations are done using css transformations, and require 0 re-renders.
- **RTL support:** `react-gantt` nativly supports RTL. simply declare one of the parent divs as rtl with `dir="rtl"`, and thats it.

![2023-06-24 12 21 52](https://github.com/samuelarbibe/react-gantt/assets/38098325/98ec3d4a-df73-4766-8be3-4b3347c65658)
