"use client";

import {Box, Card, Stack, Container, Typography} from '@mui/material';
import React, {useState, useEffect} from 'react';
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
import {AddNewTaskButton} from './AddNewTaskPopup'
import {Task} from './components/Task'
import { Grid } from '@mui/material';

export default function Home(){
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [tasks, setTasks] = useState([])

  useEffect(() => {
    fetch('http://localhost:5000/api/tasks')
      .then((res) => res.json())
      .then((data) => {
        const parsed_data: Task[] = data.map((task: any) => {
          const parsed_task = {
            id: task.id,
            task_name: task.task_name,
            description: task.description,
            sort_field: task.sort_field,
            created_at: task.created_at,
            updated_at: task.updated_at,
            move_handler: () => {return},
            view_details_handler: () => {return}
          }
          return parsed_task
        })
        setTasks(parsed_data)
      })
  }, [])

  let task_fields: number[] = []
  if(tasks.length > 0){
    tasks.forEach((task: Task) => task_fields.push(task.sort_field))
  }
  console.log(tasks)
  console.log(task_fields)
  return (
    <main>
      <Container>
        <Box justifyContent={'center'} paddingTop={4}>
          <Card>
            <center>
              <Typography variant="h2">Task Management Program</Typography>
            </center>
          </Card>
        </Box>
        <Box paddingTop={3}>
          <center>
            {AddNewTaskButton()}
          </center>
        </Box>
        <Box justifyContent={'center'}>
          <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={task_fields}
              strategy={verticalListSortingStrategy}
            >
              <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                paddingTop={3}
              >
                <Stack spacing={3}>
                  {tasks.length == 0 ? [] :
                  tasks.map((task: Task) => <SortableItem key={task.sort_field} id={task.sort_field} task={task}/>)}
                </Stack>
              </Grid>
            </SortableContext>
          </DndContext>
        </Box>
      </Container>
    </main>
  );

  function handleDragEnd(event: any) {
    const {active, over} = event;
    const sort_fields = tasks.map((task: Task) => task.sort_field)

    if (active.id === over.id) {
      return
    }

    const oldIndex = sort_fields.indexOf(active.id);
    const newIndex = sort_fields.indexOf(over.id);

    const updated_tasks = arrayMove(tasks, oldIndex, newIndex);
    setTasks(updated_tasks)
    try{
      fetch("http://localhost/api/tasks/updateorder", {
          method: "POST",
          body: JSON.stringify({
            new_sort_fields: updated_tasks.map((task: Task) => [task.id, task.sort_field])
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
        }
      ).then(json => console.log(json))
      .catch(e => console.log(e))
    } catch (err) {
        console.log(err);
    }
  }
}