import React from 'react';
import { Button, Grid } from '@mui/material';

function RoomMenu({ onCreateClick, onJoinClick }) {
    return (
        <Grid container spacing={2} justifyContent="center" sx={{ mt: 1 }}> 
            <Grid item>
                <Button
                    variant="contained"
                    size='large'
                    onClick={onCreateClick}
                    sx={{
                        backgroundColor: "orange",  
                        color: '#ffffff',  
                        fontSize: '1rem',  
                        padding: "12px 24px", 
                        width: "15rem",
                        '&:hover': {
                            backgroundColor: '#ff5722', 
                            transition: 'background-color 0.3s ease-in-out'
                        }
                    }}
                >
                    CREATE ROOM
                </Button>
            </Grid>
            <Grid item>
                <Button
                    variant="contained"
                    size='large'
                    onClick={onJoinClick}
                    sx={{
                        backgroundColor: "blue",
                        color: '#ffffff', 
                        fontSize: '1rem',
                        padding: "12px 24px",  
                        width: "15rem",
                        '&:hover': {
                            backgroundColor: '#1565c0',  
                            transition: 'background-color 0.3s ease-in-out'
                        }
                    }}
                >
                    JOIN ROOM
                </Button>
            </Grid>
        </Grid>
    );
}

export default RoomMenu;
