import {Box, Button, Card, Stack, Typography} from '@mui/material';
export const TaskBox = (
    task:
        Task) => {
    const onClick = () =>{
        console.log("clicked view details");
        task.view_details_handler(task);
    }

  return (
      <Box sx={{ border: 1, borderRadius: 1}}>
        <Card>
            <center>
                <Typography>{task.task_name}</Typography>
            </center>
            <Stack direction={"row"}
                justifyContent={'center'}
                alignItems={'center'}
                spacing={2}
                paddingBottom={0.75}
                paddingLeft={5}
                paddingRight={5}
                paddingTop={3}>
                <div data-no-dnd>
                    <Button onClick={() =>task.view_details_handler(task)}>View Details</Button>
                </div>
            </Stack>
        </Card>
        <div key={task.id} className='Task' />
    </Box>
  )
};

export type Task = {
    id: string
    task_name: string,
    description: string,
    sort_field: string,
    created_at: Date,
    updated_at: Date,
    deleted_at: Date,
    view_details_handler: Function,
    update_handler: Function,
    delete_handler: Function
};

export default Task;