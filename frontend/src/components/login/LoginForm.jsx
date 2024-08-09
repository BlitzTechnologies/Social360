import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Typography, Grid, IconButton, InputAdornment, Link, Divider } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useAuth } from '../../contexts/AuthContext';

function LoginForm() {
    const { loginUser } = useAuth();

    const [formData, setFormData] = useState({
        usernameEmail: '',
        password: '',
        rememberMe: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); 
    const [errors, setErrors] = useState({ usernameEmail: '', password: '' });
    
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (!value) {
            setErrors(prev => ({ ...prev, [name]: 'Field is required' }));
        } else {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleCheckboxChange = () => {
        setFormData(prev => ({ ...prev, rememberMe: !prev.rememberMe }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        let anyErrors = false;
        const newErrors = {
            usernameEmail: '',
            password: ''
        };
    
        if (!formData.usernameEmail.trim()) {
            newErrors.usernameEmail = 'Field is required';
            anyErrors = true;
        }
        
        if (!formData.password.trim()) {
            newErrors.password = 'Field is required';
            anyErrors = true;
        }
    
        setErrors(newErrors);
    

        if (!anyErrors) {
            loginUser(formData)
                .then(() => {
                })
                .catch((err) => {
                    const errorMessage = err.response?.data?.message || "An unexpected error occurred";
                    setErrorMessage(errorMessage);
                });
        }
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
                        backgroundImage: `url(${require('../images/login-image.jpg')})`,
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
                        <Divider />
                        <Typography variant="h6"
                            sx={{
                                textAlign: 'center',
                                color: '#cc9900',
                                mb: 3
                            }}>
                            Build Bridges with Every Click
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            {errorMessage && (
                                <Typography variant="body2" color="error" sx={{ mb: 2, textAlign: 'center' }}>
                                    {errorMessage}
                                </Typography>
                            )}
                            <TextField
                                label="Username/Email"
                                variant="outlined"
                                fullWidth
                                required
                                error={!!errors.usernameEmail}
                                helperText={errors.usernameEmail}
                                value={formData.usernameEmail}
                                onChange={handleChange}
                                name="usernameEmail"
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
                                error={!!errors.password}
                                helperText={errors.password}
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
