import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box, Grid, Link, Paper, Avatar } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import GoogleIcon from '@mui/icons-material/Google';

// ใช้ Theme ขาว-ดำ ให้เหมือนกับหน้า Login
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#ffffff' },
    background: { default: '#121212', paper: '#1e1e1e' },
    text: { primary: '#ffffff', secondary: '#b3b3b3' },
  },
});

function RegisterPage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        displayName, email, password,
      });
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error.response?.data);
      alert('Registration failed. The email might already be in use.');
    }
  };
  const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/google';
    };

  return (
    <ThemeProvider theme={darkTheme}>
      <Grid
        container
        component="main"
        sx={{
          height: '100vh',
          backgroundColor: 'background.default',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Grid
          component={Paper}
          elevation={6}
          // ปรับขนาดตามหน้าจอ
          xs={11} sm={8} md={5} lg={4}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
            backgroundColor: 'background.paper'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main', color: 'black' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>

          {/* ★★★ ส่วนของฟอร์มที่แก้ไขแล้ว ★★★ */}
          <Box component="form" noValidate onSubmit={handleRegister} sx={{ mt: 3, width: '100%' }}>

            <Grid container spacing={2}>
              <TextField
                name="displayName"
                required
                fullWidth
                label="Display Name"
                autoFocus
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <TextField
                required
                fullWidth
                label="Email Address"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3, mb: 2, py: 1.2,
                backgroundColor: 'white', color: 'black', fontWeight: 'bold',
                '&:hover': { backgroundColor: '#e0e0e0' }
              }}
            >
              Sign Up
            </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<GoogleIcon />}
                        onClick={handleGoogleLogin}
                        sx={{ 
                            mt: 1, 
                            mb: 2,
                            color: 'white',
                            borderColor: 'rgba(255, 255, 255, 0.5)'
                        }}
                    >
                        Sign Up with Google
                    </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/login" variant="body2" color="text.secondary">
                  Already have an account?
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default RegisterPage;