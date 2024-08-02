import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Typography, Grid, List, ListItem, ListItemIcon, ListItemText, IconButton, InputAdornment } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';
import registerImage from '../images/register-image.jpg';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import * as yup from 'yup';

// Create a schema for validation
const schema = yup.object({
    fullName: yup.string().required("Full name is required"),
    email: yup.string().email("Invalid email address").required("Email is required"),
    username: yup.string().required("Username is required"),
    password: yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[\^$*.\[\]{}()?\-"!@#%&/\\,><':;|_~`]/, 'Password must contain at least one special character')
        .notOneOf([yup.ref('username'), null], 'Password cannot contain your username'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords do not match')
}).required();

function RegisterForm() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        yup.reach(schema, name).validate(value).then(() => {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }).catch(err => {
            setErrors(prev => ({ ...prev, [name]: err.message }));
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        schema.validate(formData, { abortEarly: false })
            .then(() => {
                console.log('Valid Data:', formData);
                setErrors({});
                // Proceed with submission (e.g., API call)
            })
            .catch(err => {
                const newErrors = err.inner.reduce((acc, curr) => {
                    acc[curr.path] = curr.message;
                    return acc;
                }, {});
                setErrors(newErrors);
            });
    };

    const passwordValidationCriteria = [
        { test: (pwd) => pwd.length >= 8, text: "At least 8 characters" },
        { test: (pwd) => /[A-Z]/.test(pwd), text: "At least one uppercase letter" },
        { test: (pwd) => /[a-z]/.test(pwd), text: "At least one lowercase letter" },
        { test: (pwd) => /[0-9]/.test(pwd), text: "At least one number" },
        { test: (pwd) => /[\^$*.\[\]{}()?\-"!@#%&/\\,><':;|_~`]/.test(pwd), text: "At least one special character" },
    ];

    return (
        <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
            <Paper elevation={6}
                sx={{
                    display: 'flex',
                    width: {
                        xs: '90%', // On extra-small devices (mobile phones)
                        sm: '70%', // On small devices (tablets)
                        md: '60%', // On medium devices (small laptops)
                        lg: '50%', // On large devices (desktops)
                        xl: '50%'  // On extra-large devices (large screens)
                    }
                }}>
                <Grid container>
                    <Grid item xs={12} md={6} sx={{
                        backgroundImage: `url(${registerImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }} />
                    <Grid item xs={12} md={6} sx={{ padding: 3 }}>
                        <Typography variant="h4" sx={{ mb: 2, fontFamily: 'Poppins' }}>Register</Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            {Object.keys(formData).map(key => (
                                <TextField
                                    key={key}
                                    margin="normal"
                                    required
                                    fullWidth
                                    id={key}
                                    label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                                    name={key}
                                    // type={key.toLowerCase().includes("password") ? "password" : "text"}
                                    type={(key === "password" && !showPassword) || (key === "confirmPassword" && !showConfirmPassword) ? "password" : "text"}
                                    value={formData[key]}
                                    onChange={handleChange}
                                    error={!!errors[key]}
                                    helperText={errors[key]}
                                    autoComplete={key}
                                    InputProps={{
                                        endAdornment: (key === "password" || key === "confirmPassword") ? (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={key === "password" ? togglePasswordVisibility : toggleConfirmPasswordVisibility}
                                                    edge="end"
                                                >
                                                    {(key === "password" && showPassword) || (key === "confirmPassword" && showConfirmPassword) ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ) : null
                                    }}
                                    sx={{
                                        '& .MuiInputBase-root': {
                                            height: '35px'
                                        },
                                        '& .MuiFormLabel-root': {
                                            fontSize: '0.8rem',
                                            top: '-7px'
                                        },

                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#55c57a',
                                            },
                                        }
                                    }}
                                />
                            ))}
                            <List dense sx={{ marginTop: -2 }}>
                                {passwordValidationCriteria.map((criteria, index) => (
                                    <ListItem key={index}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            fontSize: '0.5rem',
                                            '& .MuiTypography-root': {
                                                fontSize: '0.7rem',
                                                marginLeft: '-35px'
                                            },
                                            '& .MuiSvgIcon-root': {
                                                fontSize: '0.7rem'
                                            }
                                        }}
                                    >
                                        <ListItemIcon>
                                            {criteria.test(formData.password) ? <CheckIcon color="success" /> : <ErrorIcon color="error" />}
                                        </ListItemIcon>
                                        <ListItemText primary={criteria.text} sx={{ color: criteria.test(formData.password) ? 'green' : 'red' }} />
                                    </ListItem>
                                ))}
                            </List>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    backgroundColor: '#00e676',
                                    '&:hover': {
                                        backgroundColor: '#55c57a',
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
