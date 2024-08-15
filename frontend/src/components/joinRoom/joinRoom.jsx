import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, CardActions, Button, TextField, IconButton, Paper, Drawer, Box, Autocomplete, Chip } from '@mui/material';
import { getRoom } from '../../api/room';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

const categoriesList = [
  'Sports', 'Finance', 'Technology', 'Entertainment', 'Education', 'Health',
  'Music', 'Art', 'Science', 'Business', 'Politics', 'Travel', 'Food', 'Lifestyle', 'History',
  // Add more categories here as needed
];

function JoinRoom() {
  const [rooms, setRooms] = useState([]); // Initialize with an empty array
  const [searchQuery, setSearchQuery] = useState(''); // For the search bar
  const [filteredRooms, setFilteredRooms] = useState([]); // For filtered rooms based on search and filter
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false); // Control filter drawer
  const [selectedCategories, setSelectedCategories] = useState([]); // Selected categories
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
      const matchesCategoryFilter = selectedCategories.length === 0 || selectedCategories.includes(room.category);

      return matchesSearchQuery && matchesParticipantsFilter && matchesCategoryFilter;
    });
    setFilteredRooms(filtered);
  }, [searchQuery, selectedCategories, participantsFilter, rooms]);

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
                <Autocomplete
                  multiple
                  options={categoriesList}
                  getOptionLabel={(option) => option}
                  value={selectedCategories}
                  onChange={(event, newValue) => setSelectedCategories(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Search Categories"
                      fullWidth // Ensure full width of the container
                      sx={{
                        '& .MuiInputBase-root': {
                          minHeight: '56px', // Ensure the input field is always tall enough
                        },
                        '& .MuiInputBase-input': {
                          whiteSpace: 'nowrap', // Prevent text from wrapping
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
                  )}
                  renderTags={() => null} // Don't render the tags here
                />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 1 }}>
                  {selectedCategories.map((category, index) => (
                    <Chip
                      key={category}
                      label={category}
                      onDelete={() => {
                        setSelectedCategories((prev) =>
                          prev.filter((item) => item !== category)
                        );
                      }}
                      sx={{
                        backgroundColor: '#e6ac00',
                        color: '#fff',
                        margin: '2px',
                        '& .MuiChip-deleteIcon': {
                          color: '#fff',
                        },
                      }}
                    />
                  ))}
                </Box>
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
