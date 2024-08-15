import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, CardActions, Button, TextField, IconButton, Paper, Drawer, Box, InputAdornment } from '@mui/material';
import { getRoom } from '../../api/room';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

function JoinRoom() {
  const [rooms, setRooms] = useState([]); // Initialize with an empty array
  const [searchQuery, setSearchQuery] = useState(''); // For the search bar
  const [filteredRooms, setFilteredRooms] = useState([]); // For filtered rooms based on search and filter
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false); // Control filter drawer
  const [categoryFilter, setCategoryFilter] = useState(''); // Example category filter
  const [participantsFilter, setParticipantsFilter] = useState(''); // Example participants filter

  useEffect(() => {
    getRoom().then(response => {
      if (response && Array.isArray(response)) {
        setRooms(response); // Directly set the rooms if the response is an array
        setFilteredRooms(response); // Initialize filteredRooms with the full list
        console.log('Rooms loaded:', response);
      } else {
        console.log('No rooms data received:', response);
      }
    }).catch(error => {
      console.error('Failed to fetch rooms:', error);
    });
  }, []);

  useEffect(() => {
    // Filter rooms based on search query (room ID) and other filters
    const filtered = rooms.filter(room =>
      (!searchQuery || room.code.toString().includes(searchQuery)) && // Search by room code (room ID)
      (!categoryFilter || room.category === categoryFilter) && // Display all rooms if categoryFilter is empty
      (!participantsFilter || room.settings.roomSize <= participantsFilter) // Display all rooms if participantsFilter is empty
    );
    setFilteredRooms(filtered);
  }, [searchQuery, categoryFilter, participantsFilter, rooms]);

  const toggleFilterDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setFilterDrawerOpen(open);
  };

  return (
    <div>
      <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ padding: 2 }}>
        <Grid item xs={12} sm={10} md={8}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: '30px', // Rounded edges
            backgroundColor: 'white',
            boxShadow: 2, // Slight shadow for better visibility
            padding: '2px 10px', // Padding inside the box
          }}>
            <SearchIcon color="action" />
            <TextField
              variant="standard"
              placeholder="Search by room ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
              InputProps={{
                disableUnderline: true, // Remove the underline
                sx: { marginLeft: 1 },
              }}
            />
            <IconButton onClick={toggleFilterDrawer(true)}>
              <FilterListIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={filterDrawerOpen}
              onClose={toggleFilterDrawer(false)}
            >
              <Paper sx={{ padding: 2, width: 300 }}>
                <Typography variant="h6">Filter Options</Typography>
                <TextField
                  label="Category"
                  fullWidth
                  margin="normal"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  sx={{
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#d68910',
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#ffbf00',
                      },
                      '&:hover fieldset': {
                        borderColor: '#d68910 ',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#d68910 ',
                      }
                    }
                  }}
                />
                <TextField
                  label="Max Participants"
                  fullWidth
                  margin="normal"
                  type="number"
                  value={participantsFilter}
                  onChange={(e) => setParticipantsFilter(e.target.value)}
                  sx={{
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#d68910',
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#ffbf00',
                      },
                      '&:hover fieldset': {
                        borderColor: '#d68910 ',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#d68910 ',
                      }
                    }
                  }}
                />
                <Button
                  variant="contained"
                  fullWidth
                  onClick={toggleFilterDrawer(false)}
                  sx={{
                    mt: 2,
                    backgroundColor: '#e6ac00',
                    '&:hover': {
                      backgroundColor: '#b38600',
                    }
                  }}
                >
                  Apply Filters
                </Button>
              </Paper>
            </Drawer>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ padding: 2 }}>
        {filteredRooms.map(room => (
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
    </div>
  );
}

export default JoinRoom;
