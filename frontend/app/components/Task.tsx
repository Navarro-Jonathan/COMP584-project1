import {Button, Chip, Grid, Stack, Typography} from '@mui/material';

export const Task = (
    {task_name, description, sort_field,
    created_at, updated_at, deleted_at,
    move_handler, view_details_handler}:
        {task_name: string, description: string, sort_field: number,
        created_at: Date, updated_at: Date, deleted_at: Date,
        move_handler: Function, view_details_handler: Function}) => {
  return (
    <Grid container spacing={2} key={task_name} justifyContent={"space-between"}>
        <Grid xs={3} item textAlign={'end'}>
            <Typography>{task_name}</Typography>
            <Stack direction={"row"}
                justifyContent={'flex-end'}
                alignItems={'center'}
                spacing={0.5}>
                <Button variant='outlined'
                    onClick={view_details_handler()}>
                    {"View Details"}
                </Button>
            </Stack>
        </Grid>
    </Grid>
  );
};

export default Task;