import React from 'react';
import { Box, TextField, Button, Paper, Typography, Grid, FormControlLabel, Checkbox } from '@mui/material';
import registerImage from '../images/register-image.jpg'


function RegisterForm() {
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get('email'),
            username: data.get('username'),
            password: data.get('password'),
        });
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
            <Paper elevation={6} sx={{ display: 'flex', width: '50%', maxHeight: '600px' }}>
                <Grid container>
                    <Grid item xs={12} md={6} sx={{
                        backgroundImage: `url(${registerImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>

                    </Grid>
                    <Grid item xs={12} md={6} sx={{ padding: 3 }}>
                        <Typography variant="h4" sx={{ mb: 2, fontFamily: 'Poppins' }}>Register</Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="fullName"
                                label="Full Name"
                                name="fullName"
                                autoFocus
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#55c57a', // Default border color
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#69f0ae', // Border color on hover
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'green', // Border color when the input is focused
                                            borderWidth: 2, // Make the border thicker on focus
                                        }
                                    }
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#55c57a', // Default border color
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#69f0ae', // Border color on hover
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'green', // Border color when the input is focused
                                            borderWidth: 2, // Make the border thicker on focus
                                        }
                                    }
                                }}

                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#55c57a', // Default border color
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#69f0ae', // Border color on hover
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'green', // Border color when the input is focused
                                            borderWidth: 2, // Make the border thicker on focus
                                        }
                                    }
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#55c57a', // Default border color
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#69f0ae', // Border color on hover
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'green', // Border color when the input is focused
                                            borderWidth: 2, // Make the border thicker on focus
                                        }
                                    }
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Repeat Password"
                                type="password"
                                id="confirmPassword"
                                autoComplete="new-password"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#55c57a', // Default border color
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#69f0ae', // Border color on hover
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'green', // Border color when the input is focused
                                            borderWidth: 2, // Make the border thicker on focus
                                        }
                                    }
                                }}
                            />
                            {/* <FormControlLabel
                                control={<Checkbox value="agree" color="primary" />}
                                label="I agree to the Terms of Use"
                            /> */}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    backgroundColor: '#00e676',
                                    '&:hover': {
                                        backgroundColor: '#55c57a', // Change to this color on hover
                                        // Optionally, you can also change other styles like the border
                                        borderColor: '#64dd17', // Example of changing the border color on hover
                                        boxShadow: '0 3px 5px 2px rgba(100, 221, 23, .3)', // Example of adding a shadow on hover
                                    }
                                }}
                            >
                                Sign Up
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}

export default RegisterForm;
