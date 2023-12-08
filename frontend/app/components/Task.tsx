import {Box, Card, Button, Grid, Stack, Typography} from '@mui/material';

export const TaskBox = (
    {id, task_name, description, sort_field,
    created_at, updated_at, deleted_at,
    move_handler, view_details_handler}:
        Task) => {
  return (
    <Box sx={{ border: 1, borderRadius: 1}}>
        <Card>
            <center>
                <Typography>{task_name}</Typography>
            </center>
            <Stack direction={"row"}
                justifyContent={'center'}
                alignItems={'center'}
                spacing={2}
                paddingBottom={0.75}
                paddingLeft={5}
                paddingRight={5}
                paddingTop={3}>
                <Button variant='outlined'
                    onClick={view_details_handler()}>
                    {"View Details"}
                </Button>
            </Stack>
        </Card>
    </Box>
  );
};

export type Task = {
    id: string
    task_name: string,
    description: string,
    sort_field: number,
    created_at: Date,
    updated_at: Date,
    deleted_at: Date,
    move_handler: Function,
    view_details_handler: Function
};

export default Task;