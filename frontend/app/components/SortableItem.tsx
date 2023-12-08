import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {Task, TaskBox} from './Task'
export function SortableItem(props: {id: number, task: Task}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: props.id});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const task = props.task
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {<TaskBox
      task_name={task.task_name}
      description={task.description}
      sort_field={task.sort_field}
      created_at={task.created_at}
      updated_at={task.updated_at}
      deleted_at={task.deleted_at}
      move_handler={task.move_handler}
      view_details_handler={task.view_details_handler}
      ></TaskBox>}
    </div>
  );
}