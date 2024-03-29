import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Avatar, Button, CssBaseline, TextField, FormControlLabel,
    Checkbox, Link, Paper, Box, Grid, Typography
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';

const theme = createTheme();

export default function Login() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const loginPayload = {
            email: data.get('email'),
            password: data.get('password'),
        };
    
        try {
            const response = await axios.post('http://localhost:5000/api/users/login', loginPayload);
            if (response.data && response.data.token) {
                localStorage.setItem('authToken', response.data.token);
                navigate('/dashboard'); // Redirect to dashboard upon successful login
            } else {
                setErrorMessage('Login successful, but no authentication token received.');
            }
        } catch (error) {
            let errMsg = 'Login failed. Please try again.';
            if (error.response && error.response.data && error.response.data.message) {
                errMsg = `Error: ${error.response.data.message}`;
            } else if (error.response && error.response.status === 404) {
                errMsg = 'User not found. Please check your email.';
            } else {
                errMsg = error.message || 'An error occurred during login';
            }
            setErrorMessage(errMsg);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid item xs={false} sm={4} md={7} sx={{ backgroundImage: 'url(https://source.unsplash.com/random)', backgroundRepeat: 'no-repeat', backgroundColor: t => t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900], backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">Sign in</Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus />
                            <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" />
                            {errorMessage && <Typography color="error" sx={{ mt: 2 }}>{errorMessage}</Typography>}
                            <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
                            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Sign In</Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="#" variant="body2">Forgot password?</Link>
                                </Grid>
                                <Grid item>
                                    <RouterLink to="/register" style={{ textDecoration: 'none' }}>
                                        {"Don't have an account? Sign Up"}
                                    </RouterLink>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}
