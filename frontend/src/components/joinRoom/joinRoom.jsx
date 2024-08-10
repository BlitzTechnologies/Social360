import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import { getRoom } from '../../api/room';


function JoinRoom() {
  const [rooms, setRooms] = useState([]); // Initialize with an empty array

  useEffect(() => {
    getRoom().then(response => {
      if (response && Array.isArray(response)) {
        setRooms(response); // Directly set the rooms if the response is an array
        console.log('Rooms loaded:', response);
      } else {
        console.log('No rooms data received:', response);
      }
    }).catch(error => {
      console.error('Failed to fetch rooms:', error);
    });
  }, []);


  return (
    <Grid container spacing={2} sx={{ padding: 2 }}>
      {rooms.map(room => (
        <Grid item xs={12} sm={6} md={4} key={room.code}> 
          <Card raised>
            <CardContent>
              <Typography variant="h5" component="div">
                Room: {room.code}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Visibility: {room.settings.visibility === 1 ? 'Private' : 'Public'}
              </Typography>
              <Typography variant="body2">
                Participants: {room.settings.roomSize}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => JoinRoom(room.id)} // Assuming you have a joinRoom function
              >
                Join Room
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default JoinRoom