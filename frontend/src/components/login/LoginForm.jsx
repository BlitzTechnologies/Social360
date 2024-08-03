import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Typography, Grid, IconButton, InputAdornment, Link, Divider } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';


function LoginForm() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberMe: false
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = () => {
        setFormData(prev => ({ ...prev, rememberMe: !prev.rememberMe }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Login Data:', formData);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                marginTop: '7rem',
                
                alignItems: 'center',
                justifyContent: 'center'
            }}>
            <Paper elevation={6} sx={{
                width: {
                    xs: '90%',
                    sm: '70%',
                    md: '60%',
                    lg: '50%',
                    xl: '50%'
                }, display: 'flex', flexDirection: 'row'
            }}>
                <Grid container>
                    <Grid item xs={12} md={6} sx={{
                        backgroundImage: `url(${require('../images/register-image.jpg')})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ p: 3 }}>
                        <Typography variant="h4"
                            sx={{
                                mb: 1,
                                textAlign: 'center'
                            }}>
                            Login
                        </Typography>
                        <Divider
                        />
                        <Typography variant="h6"
                            sx={{
                                textAlign: 'center',
                                color: '#cc9900',
                                mb: 3
                            }}>
                            Build Bridges with Every Click
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <TextField
                                label="Username"
                                variant="outlined"
                                fullWidth
                                required
                                value={formData.username}
                                onChange={handleChange}
                                name="username"
                                sx={{
                                    mb: 3,
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#ffbf00',
                                        },
                                    }
                                }}
                            />
                            <TextField
                                label="Password"
                                variant="outlined"
                                fullWidth
                                required
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                name="password"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={togglePasswordVisibility}>
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                sx={{
                                    mb: 1,
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#ffbf00',
                                        },
                                    }
                                }}
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
                                <IconButton onClick={handleCheckboxChange}
                                    sx={{
                                        color: '#ffbf00'
                                    }}
                                >
                                    {formData.rememberMe ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
                                </IconButton>
                                <Typography variant="subtitle1">Remember me</Typography>
                            </Box>
                            <Button type="submit" fullWidth variant="contained"
                                sx={{
                                    mb: 2,
                                    backgroundColor: '#e6ac00',
                                    '&:hover': {
                                        backgroundColor: '#b38600',
                                    }
                                }}>
                                Log In
                            </Button>
                            <Link href="#" variant="body2"
                                sx={{
                                    display: 'block',
                                    textAlign: 'center',
                                    color: '#b38600'
                                }}>
                                Forgot password?
                            </Link>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}

export default LoginForm;
