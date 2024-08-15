import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, CardActions, Button, TextField, IconButton, Paper, Drawer, Box, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { getRoom } from '../../api/room';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

function JoinRoom() {
  const [rooms, setRooms] = useState([]); // Initialize with an empty array
  const [searchQuery, setSearchQuery] = useState(''); // For the search bar
  const [filteredRooms, setFilteredRooms] = useState([]); // For filtered rooms based on search and filter
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false); // Control filter drawer
  const [categoryFilters, setCategoryFilters] = useState({
    sports: false,
    finance: false,
    technology: false,
    entertainment: false,
    education: false,
    health: false,
  }); // Example category filters
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
    const filtered = rooms.filter(room => {
      const matchesSearchQuery = !searchQuery || room.code.toString().includes(searchQuery);
      const matchesParticipantsFilter = !participantsFilter || room.settings.roomSize <= participantsFilter;
      const matchesCategoryFilter = Object.keys(categoryFilters).some(category => categoryFilters[category] && room.category === category);
      
      return matchesSearchQuery && matchesParticipantsFilter && (!Object.values(categoryFilters).some(v => v) || matchesCategoryFilter);
    });
    setFilteredRooms(filtered);
  }, [searchQuery, categoryFilters, participantsFilter, rooms]);

  const handleCategoryChange = (event) => {
    setCategoryFilters({
      ...categoryFilters,
      [event.target.name]: event.target.checked,
    });
  };

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
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox checked={categoryFilters.sports} onChange={handleCategoryChange} name="sports" sx={{
                      color: '#e6ac00',
                      '&.Mui-checked': {
                        color: '#e6ac00',
                      },
                    }} />}
                    label="Sports"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={categoryFilters.finance} onChange={handleCategoryChange} name="finance" sx={{
                      color: '#e6ac00',
                      '&.Mui-checked': {
                        color: '#e6ac00',
                      },
                    }} />}
                    label="Finance"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={categoryFilters.technology} onChange={handleCategoryChange} name="technology" sx={{
                      color: '#e6ac00',
                      '&.Mui-checked': {
                        color: '#e6ac00',
                      },
                    }} />}
                    label="Technology"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={categoryFilters.entertainment} onChange={handleCategoryChange} name="entertainment" sx={{
                      color: '#e6ac00',
                      '&.Mui-checked': {
                        color: '#e6ac00',
                      },
                    }} />}
                    label="Entertainment"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={categoryFilters.education} onChange={handleCategoryChange} name="education" sx={{
                      color: '#e6ac00',
                      '&.Mui-checked': {
                        color: '#e6ac00',
                      },
                    }} />}
                    label="Education"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={categoryFilters.health} onChange={handleCategoryChange} name="health" sx={{
                      color: '#e6ac00',
                      '&.Mui-checked': {
                        color: '#e6ac00',
                      },
                    }} />}
                    label="Health"
                  />
                </FormGroup>
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
          <Grid item xs={12} sm={6} md={3} lg={3} key={room.code}>
            <Card
              raised
              sx={{
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
                },
              }}
            >
              <CardContent sx={{ textAlign: 'left', padding: '10px' }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                  Room: {room.code}
                </Typography>
                <Typography sx={{ mb: 1, color: 'text.secondary', fontStyle: 'italic' }}>
                  Visibility: {room.settings.visibility === 1 ? 'Private' : 'Public'}
                </Typography>
                <Typography variant="body2" sx={{ marginBottom: '10px' }}>
                  Participants: {room.settings.roomSize}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'right', paddingBottom: '8px' }}>
                <Button
                  variant="contained"
                  sx={{
                    borderRadius: '5px',
                    textTransform: 'none',
                    padding: '6px 16px',
                    fontSize: '14px',
                    backgroundColor: '#e6ac00',
                    '&:hover': {
                      backgroundColor: '#b38600',
                    }
                  }}
                  onClick={() => JoinRoom(room.id)} // Assuming you have a joinRoom function
                >
                  Join
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
