import{j as n,a as i,F as l}from"./jsx-runtime-91a467a5.js";import{C as r}from"./index-620274f1.js";import{Basic as a}from"./External.stories-bc31748a.js";import{StackedItems as c,DisabledRows as s}from"./Timeline.stories-bd59d3d7.js";import{u as o}from"./index-1d576ef5.js";import"./index-8db94870.js";import"./_commonjsHelpers-042e6b4d.js";import"./iframe-a1af4b12.js";import"../sb-preview/runtime.js";import"./index-d475d2ea.js";import"./index-8ce4a492.js";import"./index-d37d4223.js";import"./index-f8236e9a.js";import"./index-356e4a49.js";import"./utils-8cb0c50b.js";function d(t){const e=Object.assign({h1:"h1",h4:"h4",a:"a",code:"code",ul:"ul",li:"li",strong:"strong",h2:"h2",p:"p",br:"br",pre:"pre",h3:"h3"},o(),t.components);return i(l,{children:[n(e.h1,{id:"overview",children:"Overview"}),`
`,i(e.h4,{id:"a-headless-timeline-library-based-on-dnd-kit",children:["A headless timeline library, based on ",n(e.a,{href:"https://docs.dndkit.com/",target:"_blank",rel:"nofollow noopener noreferrer",children:n(e.code,{children:"dnd-kit"})})]}),`
`,i(e.ul,{children:[`
`,i(e.li,{children:[n(e.strong,{children:"Headless:"})," ",n(e.code,{children:"dnd-timeline"})," is a headless-ui library, and contains 0 styling, aside from functional styling (position, z-index, etc.)."]}),`
`,i(e.li,{children:[n(e.strong,{children:"Hook-based:"})," exposes simple hooks like ",n(e.code,{children:"useItem"})," and ",n(e.code,{children:"useRow"}),", that should integrate seamlessly into your existing architecture."]}),`
`,i(e.li,{children:[n(e.strong,{children:"Flexible:"})," very slim and flexible by design. ",n(e.code,{children:"dnd-timeline"})," exposes utility functions and positional styling, and you can use them in conjunction with you favorite libraries - styling libraries (MUI, tailwindcss, ant-design, etc.), and functional libraries (react-virtual, framer-motion, etc.)"]}),`
`,i(e.li,{children:[i(e.strong,{children:["Based on ",n(e.a,{href:"https://docs.dndkit.com/",target:"_blank",rel:"nofollow noopener noreferrer",children:n(e.code,{children:"dnd-kit"})}),":"]})," all features exposed by the ",n(e.a,{href:"https://docs.dndkit.com/",target:"_blank",rel:"nofollow noopener noreferrer",children:n(e.code,{children:"dnd-kit"})})," library are applicable to dnd-timeline."]}),`
`,i(e.li,{children:[n(e.strong,{children:"Performant:"})," renders only when needed. All the intermediate states and animations are done using css transformations, and require 0 re-renders."]}),`
`,i(e.li,{children:[n(e.strong,{children:"RTL:"})," ",n(e.code,{children:"dnd-timeline"})," nativly supports RTL. simply declare one of the parent divs as rtl with ",n(e.code,{children:'dir="rtl"'}),", and thats it."]}),`
`]}),`
`,n(e.h2,{id:"features",children:"Features"}),`
`,i(e.ul,{children:[`
`,i(e.li,{children:[n(e.strong,{children:"Stacked rows:"})," Items whose relevance's intersect are stacked on top of each other inside the same row."]}),`
`,i(e.li,{children:[n(e.strong,{children:"Snap to Grid:"})," Items snap into a pre-defined grid when dropped, that can be changed according to zoom level."]}),`
`,i(e.li,{children:[n(e.strong,{children:"Time Axis:"})," An optional time axis can be displayed, with different markers according to zoom level."]}),`
`,i(e.li,{children:[n(e.strong,{children:"Time Cursor:"})," An optional time cursor indicating the current time on top of the timeline."]}),`
`,i(e.li,{children:[n(e.strong,{children:"Pan and zoom:"})," You can zoom by holding ",n("kbd",{children:"Ctrl"})," and scrolling using the mouse wheel, and pan by holding ",n("kbd",{children:"Ctrl + Shift"})," scrolling using the mouse wheel.",`
`,n(r,{of:c}),`
`]}),`
`,i(e.li,{children:[n(e.strong,{children:"Dynamically disabled rows and items:"})," Items and Rows can be disabled according to a client-defined logic.",`
`,n(r,{of:s}),`
`]}),`
`,i(e.li,{children:[n(e.strong,{children:"Integration with external DnD:"})," The timeline can be used in conjunction with other DnD interactions in you app, to drag items into and outside of the timeline.",`
`,n(r,{of:a}),`
`]}),`
`]}),`
`,n(e.h2,{id:"how-does-it-work",children:"How does it work?"}),`
`,i(e.p,{children:[n(e.code,{children:"dnd-timeline"})," uses the ",n(e.code,{children:"data"})," field provided on ",n(e.code,{children:"dnd-kit"}),"'s ",n(e.code,{children:"useDraggable"})," hook, to forward date utils to your event handlers.",n(e.br,{}),`
`,"The ",n(e.code,{children:"TimelineContext"})," also exposes a ",n(e.code,{children:"TimelineBag"})," object, which incudes a set of helpers to work with the timeline."]}),`
`,i(e.p,{children:["In order to handle a change in an item's relevance, all you need to do is to handle the ",n(e.code,{children:"onDragEnd"})," event, and use the provided helper to infer the updated item relevance:"]}),`
`,n(e.pre,{children:n(e.code,{className:"language-tsx",children:`const onDragEnd = (event: DragEndEvent) => {
  const overedId = event.over?.id.toString()
  if (!overedId) return

  const activeItemId = event.active.id

  const getRelevanceFromDragEvent =
    event.active?.data?.current?.getRelevanceFromDragEvent

  const updatedRelevance = getRelevanceFromDragEvent(event)

  // update item with id activeItemId with the updatedRelevance, or the updated row using overedId
}
`})}),`
`,i(e.p,{children:["This is true for all ",n(e.code,{children:"dnd-kit"})," supported handlers:"]}),`
`,i(e.ul,{children:[`
`,n(e.li,{children:n(e.code,{children:"onDragStart"})}),`
`,n(e.li,{children:n(e.code,{children:"onDragEnd"})}),`
`,n(e.li,{children:n(e.code,{children:"onDragMove"})}),`
`,n(e.li,{children:n(e.code,{children:"onDragCancel"})}),`
`]}),`
`,i(e.p,{children:[n(e.code,{children:"dnd-timeline"})," adds a set of 4 more handlers, to handle the resize event:"]}),`
`,i(e.ul,{children:[`
`,i(e.li,{children:[n(e.code,{children:"onResizeStart"})," (WIP)"]}),`
`,n(e.li,{children:n(e.code,{children:"onResizeEnd"})}),`
`,i(e.li,{children:[n(e.code,{children:"onResizeMove"})," (WIP)"]}),`
`,i(e.li,{children:[n(e.code,{children:"onResizeCancel"})," (WIP)"]}),`
`]}),`
`,i(e.p,{children:["These events act just like the ",n(e.code,{children:"dnd-kit"})," event, except that the event looks a bit different:"]}),`
`,n(e.pre,{children:n(e.code,{className:"language-ts",children:`type ResizeEvent = {
  active: Omit<Active, 'rect'> // dnd-kit's Active type
  delta: {
    x: number
  }
  direction: DragDirection // 'start' | 'end'
}
`})}),`
`,n(e.p,{children:"The resize events' data already contains the updated relevance."}),`
`,n(e.pre,{children:n(e.code,{className:"language-tsx",children:`const onResizeEnd = (event: ResizeEndEvent) => {
  const updatedRelevance = event.active.data.current?.relevance
  if (!updatedRelevance) return

  const activeItemId = event.active.id

  // update activeItemId's relevance with the updatedRelevance
}
`})}),`
`,n(e.h3,{id:"external-items",children:"External items"}),`
`,n(e.p,{children:"To handle external items, you will need to pass the dnd-timeline's helpers when defining your draggabale items:"}),`
`,n(e.pre,{children:n(e.code,{className:"language-tsx",children:`const { getRelevanceFromDragEvent, millisecondsToPixels } = useTimelineContext()

const { attributes, isDragging, listeners, setNodeRef, transform, transition } =
  useItem({
    id: props.id,
    disabled: props.disabled,
    data: {
      getRelevanceFromDragEvent,
      duration: props.duration, // the getRelevanceFromDragEvent also knows how to handle duration
    },
  })
`})}),`
`,i(e.p,{children:["For non-timeline items, like an external item, you will need to provide a ",n(e.code,{children:"duration"})," field describing the items duration in milliseconds.",n(e.br,{}),`
`,n(e.code,{children:"dnd-timeline"})," will use it to infer its location in the timeline when dropped in and pass it through the event for you to add a new timeline item."]})]})}function E(t={}){const{wrapper:e}=Object.assign({},o(),t.components);return e?n(e,Object.assign({},t,{children:n(d,t)})):d(t)}export{E as default};
//# sourceMappingURL=Overview-84be7759.js.map
