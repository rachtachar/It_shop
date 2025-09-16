import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box, Grid } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


function RegisterPage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // ฟังก์ชันสำหรับจัดการการลงทะเบียน
  const handleRegister = async (e) => {
    e.preventDefault(); // ป้องกันการรีเฟรชหน้าเว็บเมื่อกด submit
    try {
      // ส่ง request ไปยัง backend
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        displayName,
        email,
        password,
      });

      

      console.log(res.data);
      alert('Registration successful! Please log in.');
      navigate('/login'); // เมื่อสำเร็จ ให้ redirect ไปหน้า login
    } catch (error) {
      console.error('Registration failed:', error.response.data);
      alert('Registration failed. The email might already be in use.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" onSubmit={handleRegister} noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} size={12}>
              <TextField
                autoComplete="given-name"
                name="displayName"
                required
                fullWidth
                id="displayName"
                label="Display Name"
                autoFocus
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} size={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} size={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default RegisterPage;