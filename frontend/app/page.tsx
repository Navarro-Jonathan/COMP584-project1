"use client";

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import React, {useState} from 'react';
import {DndContext} from '@dnd-kit/core';
import {Draggable} from './Draggable';
import {Droppable} from './Droppable';
import {Task} from './components/Task'

export default function Home() {
  const [parent, setParent] = useState(null);
  const task = (
    <Draggable id="draggable">
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
      ></Task>
      <Task task_name='test' description='description test' sort_field={0}
      created_at={new Date("02:04:2023")}
      updated_at={new Date("02:04:2023")}
      deleted_at={new Date("02:04:2023")}
      move_handler={() => console.log("moved")}
      view_details_handler={() => console.log("view details")}
      ></Task>
    </Draggable>
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
        <DndContext onDragEnd={handleDragEnd}>
          {!parent ? task : null}
          <Droppable id="droppable">
            {parent === "droppable" ? task : 'Drop here'}
          </Droppable>
        </DndContext>
      </center>
    </Container>
  </main>
  );

  function handleDragEnd({over}: any) {
    setParent(over ? over.id : null);
  }
}