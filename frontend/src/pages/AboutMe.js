import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { 
    Container, 
    Typography, 
    Button, 
    Box, 
    AppBar, 
    Toolbar, 
    CircularProgress,
    Card,
    CardContent,
    Grid
} from '@mui/material';

function AboutMe() {
    // State สำหรับเก็บข้อมูล user ที่ได้จาก API
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // useEffect จะทำงานเมื่อ component ถูก render ครั้งแรก
    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                // ถ้าไม่มี token ให้ redirect ไปหน้า login
                navigate('/login');
                return;
            }

            try {
                // ส่ง request ไปยัง backend เพื่อขอข้อมูล profile
                // **สำคัญ:** ต้องแนบ token ไปใน header ของ request
                const res = await axios.get('http://localhost:5000/api/profile', {
                    headers: {
                        Authorization: token
                    }
                });
               

                // เก็บข้อมูล user ที่ได้จาก backend ไว้ใน state
                setUser(res.data.user);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
                // ถ้า token ไม่ถูกต้อง (เช่น หมดอายุ) ให้ลบออกจาก storage และไปหน้า login
                localStorage.removeItem('token');
                navigate('/login');
            }
        };

        fetchProfile();
    }, [navigate]);

    // ฟังก์ชันสำหรับ Logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // แสดงหน้า Loading... ขณะที่กำลังรอข้อมูลจาก backend
    if (!user) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // เมื่อได้ข้อมูล user แล้ว ให้แสดง Dashboard
    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* Navigation Bar */}
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        ShopIT Dashboard
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Container sx={{ mt: 4 }}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Welcome, {user.email}!
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Here's your overview for today.
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {/* User Info Card */}
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Your Information</Typography>
                                <Typography>Email: {user.email}</Typography>
                                <Typography>Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Typography>
                                {user.role === 'admin' && (
                                    <Button 
                                        component={Link} 
                                        to="/admin/dashboard" 
                                        variant="contained" 
                                        color="secondary" 
                                        sx={{ mt: 2 }}
                                    >
                                        Go to Admin Panel
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Placeholder Card 1 */}
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">My Orders</Typography>
                                <Typography color="text.secondary">You have no new orders.</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Placeholder Card 2 */}
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Settings</Typography>
                                <Typography color="text.secondary">Manage your account.</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default AboutMe;