import React from 'react';
import {useState, ChangeEvent, useEffect} from 'react';
import {Card, Button, TextField, Box, Modal, Backdrop, Container, Stack, Typography} from '@mui/material';
import Task from './components/Task';

export function TaskDetailsButton(task: Task) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {setOpen(false);task.update_handler()};
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([''])

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
        console.log("Delete clicked");
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
        console.log("Update clicked");
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
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                task_id: task.id,
                comment: commentText
            })
        })
        .then(task.update_handler())
        .then(() =>refresh_comments())
        .catch(e => console.log(e))
    };
    return (
        <Container>
            <div data-no-dnd>
                <Button onClick={() =>{handleOpen();refresh_comments();}}>View Details</Button>
            <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{zIndex: (theme) => theme.zIndex.drawer + 1 }}
            style={{display:'flex',alignItems:'center',justifyContent:'center'}}
            >
                <Card sx={{width: 500, padding: 5}}>
                    <Stack spacing={3}>
                        <TextField id="name-input" label="Name" variant="standard"
                        defaultValue={task.task_name}
                        onChange={_handleNameTextChanged}/>
                        <TextField id="description-input" label="Description" variant="standard"
                        defaultValue={task.description}
                        onChange={_handleDescriptionTextChanged}/>
                        <Button onClick={updateClicked}>Update</Button>
                        <Button onClick={deleteClicked}>Delete</Button>
                        {comments.length > 0 ? getCommentArray(comments) : <p></p>}
                        <TextField id="comment-input" label="Comment" variant="standard"
                        placeholder='Comment'
                        onChange={_handleCommentTextChanged}/>
                        <Button onClick={newCommentClicked}>Add Comment</Button>
                        <Button onClick={handleClose}>Close</Button>
                    </Stack>
                </Card>
            </Modal>
            </div>
        </Container>
    );
    function getCommentArray(comments: Comment[]){
        const arr: Comment[] = Array.from(comments.sort((a: Comment, b: Comment) => a.created_at - b.created_at))
        return arr.map((comment, i) => <p key={i}>{comment.task_comment}</p>)
    }
    function refresh_comments(){
        fetch("http://localhost:5000/api/comments", {
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
    }
  }
export type Comment = {
    id: string,
    task_id: string,
    task_comment: string,
    created_at: string,
    updated_at: string,
    deleted_at: string
};