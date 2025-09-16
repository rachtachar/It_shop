import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box,  } from '@mui/material';
import axios from 'axios';
import { useNavigate, Link} from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token); // เก็บ token
      navigate('/dashboard'); // ไปยังหน้า Dashboard
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login Failed!');
    }
  };

  const handleGoogleLogin = () => {
    // Redirect ไปยัง Backend เพื่อเริ่มกระบวนการ OAuth
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Sign In</Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 1, mb: 1 }}>Sign In</Button>
          <Button size="small" fullWidth variant="contained" sx={{ mt: 1, mb: 1 }} component={Link} to={`/register`} >Sign Up</Button>
          <Button fullWidth variant="outlined" onClick={handleGoogleLogin}>Sign In with Google</Button>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;