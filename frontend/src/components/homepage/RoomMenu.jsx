import React from 'react';
import { Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function RoomMenu() {
    const navigate = useNavigate(); 

    const handleCreateClick = () => {
        navigate('/createroom'); 
    };
    return (
        <Grid container spacing={2} justifyContent="center" sx={{ mt: 1 }}> 
            <Grid item>
                <Button
                    variant="contained"
                    size='large'
                    // onClick={onCreateClick}
                    onClick={handleCreateClick} // Use the new handler that navigates
                    sx={{
                        backgroundColor: "orange",  
                        color: '#ffffff',  
                        fontSize: '1rem',  
                        padding: "12px 24px", 
                        width: "15rem",
                        fontFamily: "Poppins",
                        '&:hover': {
                            backgroundColor: '#ff5722', 
                            transition: 'background-color 0.3s ease-in-out',
                        
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
                    // onClick={onJoinClick}
                    sx={{
                        backgroundColor: "#1565c0",
                        color: '#ffffff', 
                        fontSize: '1rem',
                        padding: "12px 24px",  
                        width: "15rem",
                        fontFamily: "Poppins",
                        '&:hover': {
                            backgroundColor: 'blue',  
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
