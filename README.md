![Screenshot 2024-07-04 at 22 01 52](https://github.com/samuelarbibe/dnd-timeline/assets/38098325/f3229bc4-c855-4b50-9ab2-9fd2ac37f0ca)

# [🎉 dnd-timeline](https://dnd-timeline.com)

## dnd-timeline: A headless timeline library, based on [`dnd-kit`](https://docs.dndkit.com/)
![npm bundle size](https://img.shields.io/bundlephobia/min/dnd-timeline)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/dnd-timeline)

## Support

If you find this project helpful, consider supporting me on [Buy Me a Coffee](https://www.buymeacoffee.com/samuelarbibe)!

- 🧠 **Headless:** `dnd-timeline` is a headless-ui library, and contains 0 styling, aside from functional styling (position, z-index, etc.).
- 🪝 **Hook-based :** exposes simple hooks like `useItem` and `useRow`, that should integrate seamlessly into your existing architecture.
- 🤺 **Flexible:** very slim and flexible by design. `dnd-timeline` exposes utility functions and positional styling, and you can use them in conjunction with you favorite libraries - styling libraries (MUI, tailwindcss, ant-design, etc.), and functional libraries (react-virtual, framer-motion, etc.)
- 🏗️ **Based on [`dnd-kit`](https://docs.dndkit.com/) :** all features exposed by the [`dnd-kit`](https://docs.dndkit.com/) library are applicable to dnd-timeline.
- 🏎️ **Performant:** renders only when needed. All the intermediate states and animations are done using css transformations, and require 0 re-renders.
- 👆 **Touch Support:** Works with touch by default. Sensors can be highly configured using [`dnd-kit`](https://docs.dndkit.com/)'s sensors.
- 🌍 **RTL:** `dnd-timeline` nativly supports RTL. simply declare one of the parent divs as rtl with `dir="rtl"`, and thats it.

![2024-03-09 00 35 27](https://github.com/samuelarbibe/dnd-timeline/assets/38098325/39e1e0c7-22ac-4286-8f35-58dc7380b7eb)

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

## Examples
- [**External**](https://dnd-timeline-external.vercel.app/): Drag items from outside to the timeline, from one timeline to another, nest timelines in each other... What ever you want!   
- [**Timeaxis**](https://dnd-timeline-timeaxis.vercel.app/): Add custom components using the timeline's data, for example a timeaxis with custom labels.   
- [**Sortable**](https://dnd-timeline-sortable.vercel.app/): Allow for sortable rows.   
- [**Virtual**](https://dnd-timeline-virtual.vercel.app/): Render thousands of items and rows using your favorite virtualization library.   
- [**Grouped**](https://dnd-timeline-grouped.vercel.app/): Group the rows in any way you like.   
- [**Performance**](https://dnd-timeline-performance.vercel.app): Debounce scrolling and panning to allow for a large amount of items at once.
- [**Drag to Create**](https://dnd-timeline-create.vercel.app/): Create items on the timeline by dragging their shape on a row.

#### 💡 These are just a few examples of what can be done with this library.  
I invite you to share your ideas, and challange the library with any idea you come up with by opening a discussion [**here**](https://github.com/samuelarbibe/dnd-timeline/discussions/categories/ideas).

## Contribution

This project uses [turborepo](https://turbo.build/repo/docs) to manage the monorepo.
It also uses [pnpm](https://pnpm.io/) instead of npm as a package manager.

To install pnpm, you can run:
```sh
corepack enable pnpm
```

If you want to develop on your local machine, simply clone the project, and run

```sh
pnpm install
pnpm run dev
```

And all the examples will run on your local machine, likned to the local instance of the library.
Any changes made to the library will be reflected in the examples.

If you want to run only a specific example, checkout turborepo's [`--filter`](https://turbo.build/repo/docs/crafting-your-repository/running-tasks#using-filters) operator:
```sh
pnpm run dev --filter home...
```
For example this will run the `home` package and all the packages' it is depending on (`dnd-timeline`).
  
Good luck 🤞
