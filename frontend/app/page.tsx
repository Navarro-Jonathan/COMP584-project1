"use client";

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import React, {useState} from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {SortableItem} from './components/SortableItem';
import {Task} from './components/Task'

export default function Home() {
  const [items, setItems] = useState([1, 2, 3]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const task = (
    <p><Task task_name='test' description='description test' sort_field={0}
      created_at={new Date("02:04:2023")}
      updated_at={new Date("02:04:2023")}
      deleted_at={new Date("02:04:2023")}
      move_handler={() => console.log("moved")}
      view_details_handler={() => console.log("view details")}
      ></Task>
      <Task task_name='test' description='description test' sort_field={0}
      created_at={new Date("02:04:2023")}
      updated_at={new Date("02:04:2023")}
      deleted_at={new Date("02:04:2023")}
      move_handler={() => console.log("moved")}
      view_details_handler={() => console.log("view details")}
      ></Task>
      <Task task_name='test' description='description test' sort_field={0}
      created_at={new Date("02:04:2023")}
      updated_at={new Date("02:04:2023")}
      deleted_at={new Date("02:04:2023")}
      move_handler={() => console.log("moved")}
      view_details_handler={() => console.log("view details")}
      ></Task></p>
      );

  return (
    <main>
    <Container>
      <Box>
        <Card>
          <Typography variant="h2">Task Management Program</Typography>
        </Card>
      </Box>
      <center>
        <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items}
          strategy={verticalListSortingStrategy}
        >
          {items.map(id => <SortableItem key={id} id={id} />)}
        </SortableContext>
      </DndContext>
      </center>
    </Container>
  </main>
  );

  function handleDragEnd(event: any) {
    const {active, over} = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
}