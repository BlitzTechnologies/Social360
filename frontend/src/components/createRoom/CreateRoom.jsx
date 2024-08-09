import React, { useState } from 'react';
import { Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Typography, Box, Snackbar, Alert } from '@mui/material';
import { RoomVisibility } from '../../enums/enum.js'; 

function CreateRoomForm() {
    const [roomDetails, setRoomDetails] = useState({
        numberOfParticipants: '',
        visibility: ''
    });
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setRoomDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!roomDetails.visibility || !roomDetails.numberOfParticipants) {
            setOpenSnackbar(true);
        } else {
            console.log('Room Details:', roomDetails);
            // Proceed with form submission logic
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '60vh'
            }}>
            <Paper
                elevation={6}
                sx={{
                    p: 4,
                    width: '90%',
                    maxWidth: '500px'
                }}>
                <Typography
                    variant="h4"
                    sx={{
                        mb: 4,
                        textAlign: 'center',
                        color: '#cc9900'
                    }}>
                    Create a Room
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={7}>
                            <FormControl fullWidth required>
                                <InputLabel id="visibility-label">Visibility</InputLabel>
                                <Select
                                    labelId="visibility-label"
                                    label="Visibility"
                                    name="visibility"
                                    value={roomDetails.visibility}
                                    onChange={handleChange}
                                >
                                    <MenuItem value={RoomVisibility.private}>Private</MenuItem>
                                    <MenuItem value={RoomVisibility.public}>Public</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={5}>
                            <FormControl fullWidth required>
                                <InputLabel id="number-of-participants-label">Participants</InputLabel>
                                <Select
                                    labelId="number-of-participants-label"
                                    label="Participants"
                                    name="numberOfParticipants"
                                    value={roomDetails.numberOfParticipants}
                                    onChange={handleChange}
                                >
                                    {[1, 2, 3, 4, 5, 6].map(number => (
                                        <MenuItem key={number} value={number}>{number}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                fullWidth variant="contained"
                                color="primary"
                                sx={{
                                    mt: 2,
                                    backgroundColor: '#e6ac00',
                                    '&:hover': {
                                        backgroundColor: '#b38600',
                                    }
                                }}>
                                Create Room
                            </Button>
                        </Grid>
                    </Grid>
                </form>
                <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                        Please select all fields
                    </Alert>
                </Snackbar>
            </Paper>
        </Box>
    );
}

export default CreateRoomForm;
