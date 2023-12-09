"use client";

import {Box, Card, Button, Stack, Container, Typography} from '@mui/material';
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
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {SortableItem} from './components/SortableItem';
import {AddNewTaskButton} from './AddNewTaskPopup'
import { TaskDetailsPopup } from './TaskDetailsPopup';
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
  let selectedTask = null
  useEffect(() => {
    fetch('http://localhost:5000/api/tasks')
      .then((res) => res.json())
      .then((data) => {
          const parsed_data = parse_task_data(data)
          setTasks(parsed_data);
          console.log(parsed_data);
        })
  }, [])
  tasks.sort((a: Task, b: Task) => Number(a.sort_field) - Number(b.sort_field))
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
            {AddNewTaskButton(()=>refresh_tasks())}
          </center>
        </Box>
        <Box paddingTop={3}>
          <center>
            {selectedTask ? TaskDetailsPopup(selectedTask) : <div />}
          </center>
        </Box>
        <Box justifyContent={'center'}>
          <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={tasks}
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

    fetch("http://localhost:5000/api/tasks/updateorder", {
      method: "POST",
      body: JSON.stringify({
        old_index: oldIndex,
        new_index: newIndex
      }),
      headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      }
      )
      .then(res => {
        if (res.ok){
          return res.json()
        }
      })
      .then(json => setTasks(parse_task_data(json)))
      .catch(e => console.log(e))
  }
  function parse_task_data(data: any){
    if (data == null){
      return []
    }
    const parsed_data: Task[] = data.map((task: Task) => {
      const parsed_task: Task = {
        id: task.id,
        task_name: task.task_name,
        description: task.description,
        sort_field: String(task.sort_field),
        created_at: task.created_at,
        updated_at: task.updated_at,
        deleted_at: task.deleted_at,
        view_details_handler: (task: Task)=>{
          console.log("view details handled");
          selectedTask = task;},
        update_handler: () => {refresh_tasks()},
        delete_handler: () => {refresh_tasks()}
      };
      return parsed_task;
    });
    const deleted_removed: Task[] = []
    parsed_data.forEach((task: Task) => {
      if(task.deleted_at == null) deleted_removed.push(task)
    })
    return deleted_removed;
  }
  function refresh_tasks(){
    console.log("refreshing")
    fetch('http://localhost:5000/api/tasks')
    .then((res) => res.json())
    .then((data) => {
        const parsed_data = parse_task_data(data)
        setTasks(parsed_data);
        console.log(parsed_data);
      })
  }
}