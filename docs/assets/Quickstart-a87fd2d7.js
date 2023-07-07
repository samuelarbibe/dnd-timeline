import{j as n,a as i,F as d}from"./jsx-runtime-91a467a5.js";import{C as l}from"./index-620274f1.js";import{UnstackedItems as s}from"./Timeline.stories-bd59d3d7.js";import{u as r}from"./index-1d576ef5.js";import"./index-8db94870.js";import"./_commonjsHelpers-042e6b4d.js";import"./iframe-a1af4b12.js";import"../sb-preview/runtime.js";import"./index-d475d2ea.js";import"./index-8ce4a492.js";import"./index-d37d4223.js";import"./index-f8236e9a.js";import"./index-356e4a49.js";import"./utils-8cb0c50b.js";function o(t){const e=Object.assign({h1:"h1",h3:"h3",h4:"h4",p:"p",code:"code",pre:"pre",br:"br",a:"a"},r(),t.components);return i(d,{children:[n(e.h1,{id:"quickstart",children:"Quickstart"}),`
`,n(e.h3,{id:"context",children:"Context"}),`
`,n(e.h4,{id:"simple",children:"Simple"}),`
`,i(e.p,{children:["Use the ",n(e.code,{children:"TimelineContext"})," to wrap your timeline, and access the timeline helpers using the ",n(e.code,{children:"useTimelineContext"})," hook."]}),`
`,i(e.p,{children:["This is the recommended way to use the ",n(e.code,{children:"dnd-timeline"})]}),`
`,n(e.pre,{children:n(e.code,{className:"language-jsx",children:`import { DndContext } from '@dnd-kit/core'
import { TimelineContext, useTimelineContext } from 'dnd-timeline'

function TimelineContainer() {
  return (
    <TimelineContext
    // Timeline options
    >
      <Timeline />
    </TimelineContext>
  )
}
`})}),`
`,n(e.pre,{children:n(e.code,{className:"language-jsx",children:`import { DndContext } from '@dnd-kit/core'
import { TimelineContext, useTimelineContext } from 'dnd-timeline'

function Timeline() {
  const timelineBag = useTimelineContext()

  return (
    <div ref={timelineBag.timelineRef} style={timelineBag.style}>
      {
        // rows and items
      }
    </div>
  )
}
`})}),`
`,n(e.h4,{id:"advanced",children:"Advanced"}),`
`,i(e.p,{children:["Use the ",n(e.code,{children:"useTimeline"})," hook, and expose the ",n(e.code,{children:"TimelineBag"})," using the ",n(e.code,{children:"TimelineProvider"}),"."]}),`
`,i(e.p,{children:["the ",n(e.code,{children:"TimelineProvider"})," doesn't wrap you code with the ",n(e.code,{children:"DndContext"}),", so you will need to do it yourself.",n(e.br,{}),`
`,"This also means that you can put the ",n(e.code,{children:"DndContext"})," anywhere you want, allowing for integration with external DnD lists and timeline's."]}),`
`,i(e.p,{children:["To define a timeline container div, youll need to pass the ",n(e.code,{children:"timelineRef"})," as a ",n(e.code,{children:"ref"})," to that element, and pass the funtional styling as well."]}),`
`,n(e.pre,{children:n(e.code,{className:"language-jsx",children:`import { DndContext } from '@dnd-kit/core'
import { TimelineProvider, useTimeline } from 'dnd-timeline'

function TimelineContainer() {
  const timelineBag = useTimeline({
    // Timeline options
  })

  return (
    <DndContext
    // dnd-kit options
    >
      <TimelineProvider value={timelineBag}>
        <div ref={timelineBag.timelineRef} style={timelineBag.style}>
          {
            // rows and items
          }
        </div>
      </TimelineProvider>
    </DndContext>
  )
}
`})}),`
`,n(e.h3,{id:"rows",children:"Rows"}),`
`,i(e.p,{children:["The ",n(e.code,{children:"Row"})," component acts as a ",n(e.a,{href:"https://docs.dndkit.com/api-documentation/droppable",target:"_blank",rel:"nofollow noopener noreferrer",children:"Droppable"})," for items to be dropped into."]}),`
`,i(e.p,{children:["To create a row component, use the ",n(e.code,{children:"useRow"})," hook.",n(e.br,{}),`
`,"To get going, you can use this simple Row HOC component:"]}),`
`,n(e.pre,{children:n(e.code,{className:"language-jsx",children:`import React, { ReactNode, useMemo } from 'react'
import { RowDefinition, useRow } from 'dnd-timeline'

interface RowProps extends RowDefinition {
  id: string
  sidebar: ReactNode
  children: ReactNode
}

function Row(props: RowProps) {
  const {
    isOver,
    rowStyle,
    setNodeRef,
    setSidebarRef,
    rowWrapperStyle,
    rowSidebarStyle,
  } = useRow({
    id: props.id,
    disabled: props.disabled,
  })

  return (
    <div style={rowWrapperStyle}>
      <div ref={setSidebarRef} style={rowSidebarStyle}>
        {props.sidebar}
      </div>
      <div
        ref={setNodeRef}
        style={rowStyle}
      >
        {props.children}
      </div>
    </div>
  )
}
`})}),`
`,i(e.p,{children:["You can then use this row component to wrap you items on each rows.",n(e.br,{}),`
`,"rows should be an array of type ",n(e.code,{children:"RowDefinition[]"})]}),`
`,n(e.pre,{children:n(e.code,{className:"language-jsx",children:`<div ref={timelineBag.timelineRef} style={timelineBag.style}>
  {rows.map((row) => (
    <Row
      id={row.id}
      key={row.id}
      sidebar={<div style={{ width: 200 }}>{row.id}</div>}
    >
      {
        // you items here
      }
    </Row>
  ))}
</div>
`})}),`
`,n(e.h3,{id:"items",children:"Items"}),`
`,i(e.p,{children:["The ",n(e.code,{children:"Item"})," component acts as a ",n(e.a,{href:"https://docs.dndkit.com/api-documentation/draggable",target:"_blank",rel:"nofollow noopener noreferrer",children:"Draggable"}),"."]}),`
`,i(e.p,{children:["To create a row component, use the ",n(e.code,{children:"useItem"})," hook.",n(e.br,{}),`
`,"To get going, you can use this simple Item HOC component:"]}),`
`,n(e.pre,{children:n(e.code,{className:"language-jsx",children:`import React, { ReactNode, useMemo } from 'react'
import { ItemDefinition, useItem } from 'dnd-timeline'

interface ItemProps extends ItemDefinition {
  children: ReactNode;
}

function Item(props: ItemProps) {
  const { itemStyle, listeners, attributes, setNodeRef, itemContentStyle } =
    useItem({
      id: props.id,
      relevance: props.relevance,
    })

  return (
    <div ref={setNodeRef} style={itemStyle} {...listeners} {...attributes}>
      <div style={itemContentStyle}>{props.children}</div>
    </div>
  )
}
`})}),`
`,n(e.p,{children:"You can then use it to wrap you own item components, that are going to be displayed inside each item."}),`
`,i(e.p,{children:[n(e.code,{children:"groupedItems"})," is an object of type ",n(e.code,{children:"Record<string, ItemDefinition[]>"}),", but you can do it however you see fit."]}),`
`,n(e.pre,{children:n(e.code,{className:"language-jsx",children:`<div ref={timelineBag.timelineRef} style={timelineBag.style}>
  {rows.map((row) => (
    <Row
      id={row.id}
      key={row.id}
      sidebar={<div style={{ width: 200 }}>{row.id}</div>}
    >
      {groupedItems[row.id]?.map((item) => (
        <Item
          id={item.id}
          key={item.id}
          rowId={row.id}
          relevance={item.relevance}
        >
          {
            // Item content
          }
        </Item>
      ))}
    </Row>
  ))}
</div>
`})}),`
`,n(e.p,{children:"Add a little bit of styling, and you will get something like this:"}),`
`,`
`,n(l,{of:s}),`
`,i(e.p,{children:["You can find all of the examples' code in the ",n(e.a,{href:"https://github.com/samuelarbibe/dnd-timeline/tree/main/stories",target:"_blank",rel:"nofollow noopener noreferrer",children:"github repository"})]})]})}function T(t={}){const{wrapper:e}=Object.assign({},r(),t.components);return e?n(e,Object.assign({},t,{children:n(o,t)})):o(t)}export{T as default};
//# sourceMappingURL=Quickstart-a87fd2d7.js.map
