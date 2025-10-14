import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
    Button, 
    TextField, 
    Box, 
    Grid, 
    Typography,
    Avatar,
    Link,
    Paper
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import GoogleIcon from '@mui/icons-material/Google';

// 1. สร้าง Theme ขาว-ดำ
const darkTheme = createTheme({
    palette: {
        mode: 'dark', // เปิด Dark Mode
        primary: {
            main: '#ffffff', // สีหลักคือสีขาว
        },
        background: {
            default: '#121212', // สีพื้นหลังหลัก
            paper: '#1e1e1e', // สีพื้นหลังของ Paper
        },
        text: {
            primary: '#ffffff', // สีข้อความหลัก
            secondary: '#b3b3b3', // สีข้อความรอง
        },
    },
});

//ส่วนของ function LoginPage()
function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login Failed!');
        }
    };
    // 2. ฟังก์ชันสำหรับ Google Login (ใช้ฟังก์ชันเดิมของคุณ)
    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/google';
    };

    //ส่วนพวก แต่งสวยงาม
    return (
        <ThemeProvider theme={darkTheme}>
            <Grid 
                container 
                component="main" 
                sx={{ 
                    height: '100vh',
                    backgroundColor: 'background.default', // 2. ใช้สีพื้นอกจาก Theme
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Grid 
                    item 
                    xs={11} 
                    sm={8} 
                    md={5} 
                    lg={4}
                    component={Paper} 
                    elevation={6} // เพิ่มเงาให้ดูมีมิติ
                    sx={{
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRadius: 2,
                        backgroundColor: 'background.paper' // 3. ใช้สีกระดาษจาก Theme
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main', color: 'black' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign In
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {/* 4. ปุ่ม Sign In ที่มีความคมชัดสูง */}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ 
                                mt: 3, 
                                mb: 2,
                                py: 1.2,
                                backgroundColor: 'white', // พื้นหลังสีขาว
                                color: 'black', // ตัวอักษรสีดำ
                                fontWeight: 'bold',
                                '&:hover': {
                                    backgroundColor: '#e0e0e0' // สีตอนเอาเมาส์ไปชี้
                                }
                            }}
                        >
                            Sign In
                        </Button>
                        {/* --- 2. เพิ่มปุ่ม Google Login ตรงนี้ --- */}
                        <Button
                            fullWidth
                            variant="outlined" // ใช้ variant "outlined" เพื่อให้ดูแตกต่าง
                            startIcon={<GoogleIcon />} // เพิ่มไอคอน Google ด้านหน้า
                            onClick={handleGoogleLogin} // เรียกใช้ฟังก์ชันเดิมของคุณ
                            sx={{ 
                                mt: 1, 
                                mb: 2,
                                color: 'white', // สีตัวอักษร
                                borderColor: 'rgba(255, 255, 255, 0.5)' // สีขอบ
                            }}
                        >
                            Sign In with Google
                        </Button>
                        {/* ---------------------------------- */}
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link component={RouterLink} to="/register" variant="body2" color="text.secondary">
                                    Don't have an account?
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default LoginPage;