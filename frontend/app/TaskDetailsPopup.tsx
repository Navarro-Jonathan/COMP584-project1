import React from 'react';
import {useState, ChangeEvent, useEffect} from 'react';
import {Card, Button, TextField, Modal, Container, Stack} from '@mui/material';
import Task from './components/Task';

export function TaskDetailsPopup(task: Task) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([''])
    useEffect(() => {
        fetch("http://localhost:5000/api/tasks/updateorder", {
            method: "POST",
            body: JSON.stringify({
                task_id: task.id
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
                }
        })
        .then((res) => res.json())
        .then((data) => {
            setComments(data);
        })
      })

    console.log(task)
    if(task == null){
        setOpen(false)
        return
    }

    const _handleNameTextChanged = (event: ChangeEvent<HTMLInputElement>): void => {
        if(event == null){
            return
        }
        setName(event.target.value);
    };
    const _handleDescriptionTextChanged = (event: ChangeEvent<HTMLInputElement>): void => {
        if(event == null){
            return
        }
        setDescription(event.target.value);
    };
    const _handleCommentTextChanged = (event: ChangeEvent<HTMLInputElement>): void => {
        if(event == null){
            return
        }
        setCommentText(event.target.value);
    };
    const deleteClicked = () => {
        console.log("Delete clicked")
        handleClose();
        fetch("http://localhost:5000/api/task/delete", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                task_id: task.id
            })
        })
        .then(task.update_handler())
        .catch(e => console.log(e))
    };
    const updateClicked = () => {
        console.log("Update clicked")
        fetch("http://localhost:5000/api/task/update", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                task_id: task.id,
                name: name,
                description: description
            })
        })
        .then(task.update_handler())
        .catch(e => console.log(e))
    };

    const newCommentClicked = () => {
        console.log("Update clicked")
        fetch("http://localhost:5000/api/comment/create", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                task_id: task.id,
                comment: commentText
            })
        })
        .then(task.update_handler())
        .catch(e => console.log(e))
    };

    return (
        <Container>
            <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            style={{display:'flex',alignItems:'center',justifyContent:'center'}}
            >
                <Card sx={{width: 500, padding: 5}}>
                    <Stack spacing={3}>
                        <TextField id="name-input" label="Name" variant="standard"
                        placeholder='Name'
                        onChange={_handleNameTextChanged}/>
                        <TextField id="description-input" label="Description" variant="standard"
                        placeholder='Description'
                        onChange={_handleDescriptionTextChanged}/>
                        {comments}
                        <Button onClick={updateClicked}>Update</Button>
                        <Button onClick={deleteClicked}>Delete</Button>
                        <TextField id="comment-input" label="Comment" variant="standard"
                        placeholder='Comment'
                        onChange={_handleCommentTextChanged}/>
                        <Button onClick={newCommentClicked}>Add Comment</Button>
                    </Stack>
                </Card>
            </Modal>
        </Container>
    );
  }