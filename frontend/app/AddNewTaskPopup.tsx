import React from 'react';
import {useState, ChangeEvent} from 'react';
import {Card, Button, TextField, Modal, Container, Stack} from '@mui/material';

export function AddNewTaskButton(onExit: Function) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

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

    const createClicked = () => {
        console.log("Create clicked")
        fetch("http://localhost:5000/api/task/create", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                name: name,
                description: description
            })
        })
        .then(()=>onExit())
        .catch(e => console.log(e))
        handleClose();
    };

    return (
        <Container>
            <Button onClick={handleOpen}>Add new task</Button>
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
                        <Button onClick={createClicked}>Create</Button>
                    </Stack>
                </Card>
            </Modal>
        </Container>
    );
  }