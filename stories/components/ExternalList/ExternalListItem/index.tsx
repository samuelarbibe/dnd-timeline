import React, { CSSProperties, ReactNode } from 'react'

import classes from './ExternalListItem.module.css'

import { CSS } from '@dnd-kit/utilities'
import { useGanttContext } from 'react-gantt'
import { useSortable } from '@dnd-kit/sortable'

import { ListItemDefinition } from '..'

interface ExternalListItemProps extends ListItemDefinition {
  children: ReactNode
}

function ExternalListItem(props: ExternalListItemProps) {
  const { getRelevanceFromDragEvent, millisecondsToPixels } = useGanttContext()

  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: props.id,
    disabled: props.disabled,
    data: {
      type: 'list-item',
      duration: props.duration,
      getRelevanceFromDragEvent,
    },
  })

  const width = isDragging ? millisecondsToPixels(props.duration) + 'px' : ''

  const style: CSSProperties = {
    width,
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
  }

  return (
    <li
      className={classes['item-wrapper']}
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      {...listeners}
    >
      {props.children}
    </li>
  )
}

export default ExternalListItem
