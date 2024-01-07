import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
    Avatar, Button, CssBaseline, TextField, FormControlLabel, Checkbox, Link, Paper, Box, Grid, Typography, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { registerUser } from '../utils/api'; // Update the path accordingly

const theme = createTheme();

export default function Register() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [role, setRole] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const registerPayload = {
            name: data.get('name'),
            email: data.get('email'),
            password: data.get('password'),
            role
        };

        try {
            const response = await registerUser(registerPayload);
            if (response && response.token) {
                localStorage.setItem('authToken', response.token);
                navigate('/dashboard'); // Redirect to dashboard upon successful registration
            } else {
                setErrorMessage('Registration successful, but no authentication token received.');
            }
        } catch (error) {
            let errMsg = 'Registration failed. Please try again.';
            if (error.response && error.response.data) {
                errMsg = `Error: ${error.response.data.message || 'Registration failed'}`;
            } else {
                errMsg = error.message || 'An error occurred during registration';
            }
            setErrorMessage(errMsg);
        }
    };

    const handleRoleChange = (event) => {
        setRole(event.target.value);
    };

    return (
        <ThemeProvider theme={theme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid item xs={false} sm={4} md={7} sx={{ backgroundImage: 'url(https://source.unsplash.com/random?technology)', backgroundRepeat: 'no-repeat', backgroundColor: t => t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900], backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">Sign Up</Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <TextField margin="normal" required fullWidth id="name" label="Full Name" name="name" autoComplete="name" autoFocus />
                            <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" />
                            <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" />
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="role-label">Role</InputLabel>
                                <Select
                                    labelId="role-label"
                                    id="role"
                                    value={role}
                                    label="Role"
                                    onChange={handleRoleChange}
                                >
                                    <MenuItem value="Inspection">Inspector</MenuItem>
                                    <MenuItem value="SupplierQuality">Supplier Quality Engineer</MenuItem>
                                    <MenuItem value="Shipping">Shipping</MenuItem>
                                </Select>
                            </FormControl>
                            {errorMessage && <Typography color="error" sx={{ mt: 2 }}>{errorMessage}</Typography>}
                            <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
                            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Sign Up</Button>
                            <Grid container>
                                <Grid item>
                                    <Link href="/login" variant="body2">{"Already have an account? Sign in"}</Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}
