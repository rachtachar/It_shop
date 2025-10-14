import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { 
    Container, Typography, Button, Box, CircularProgress,
    Card, CardContent, Grid, Dialog, DialogTitle, DialogContent,IconButton
} from '@mui/material';
import Navbar from '../components/Navbar';
import SettingForm from '../components/settingform';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


function AboutMe() {
    // State สำหรับเก็บข้อมูล user ที่ได้จาก API
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };  
    const handleClose = () => {
        setOpen(false);
    }
    // ฟังก์ชันสำหรับจัดการการส่งข้อมูลจาก SettingForm
const handleSettingsSubmit = async (formData) => {
    try {
        const token = localStorage.getItem('token');
        // แก้ไขจาก .post เป็น .put ให้ตรงกับ API ใน server.js
        const res = await axios.put('http://localhost:5000/api/profile', formData, {
            headers: {
                Authorization: token
            }
        });

        setUser(res.data.user); // อัปเดตข้อมูลในหน้า
        handleClose(); // ปิด dialog
    } catch (error) {
        console.error('Error updating profile:', error);
    }
};



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
    // const handleLogout = () => {
    //     localStorage.removeItem('token');
    //     navigate('/login');
    // };

    // แสดงหน้า Loading... ขณะที่กำลังรอข้อมูลจาก backend
    if (!user) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }
console.log(user.displayName);
    // เมื่อได้ข้อมูล user แล้ว ให้แสดง Dashboard
     return (
        <>
            <Navbar />
            <Container sx={{ mt: 4 }}>
                <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/dashboard')}
                sx={{ mb: 2 }}
                color='black'
            >
                Back to Shop
            </Button>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Welcome, {user.displayName || user.email}!
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {/* User Info Card */}
                   <Grid item xs={12} md={6}>
    <Card>
        <CardContent>
            <Typography variant="h6">Your Information</Typography>
            <Typography>Email: {user.email}</Typography>
            <Typography>Display Name: {user.displayName || 'N/A'}</Typography>
            <Typography>Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Typography>
            
            
            {/* --- ใช้ Box จัดการ Layout ของปุ่ม --- */}
            {user.role === 'admin' && (
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', // <-- 1. จัดเรียงในแนวตั้ง
                    alignItems: 'flex-start', // <-- 2. จัดให้ปุ่มชิดซ้าย
                    mt: 2 // <-- 3. เพิ่มระยะห่างด้านบน
                }}>
                    <Button 
                        component={Link} 
                        to="/admin/product_manage" 
                        variant="contained" 
                        color="secondary"
                        sx={{ mb: 1, backgroundColor:"red" }} // <-- 4. เพิ่มระยะห่างระหว่างปุ่ม
                    >
                        Go to Product Manage
                    </Button>
                    <Button 
                        component={Link} 
                        to="/admin/user_manage" 
                        variant="contained" 
                        color="secondary" 
                        sx={{ mt: 1, backgroundColor:"red" }} // <-- 4. เพิ่มระยะห่างระหว่างปุ่ม
                    >
                        Go to User Manage
                    </Button>
                </Box>
            )}
            {/* ------------------------------------ */}
            
        </CardContent>
    </Card>
</Grid>
                    
                    {/* Settings Card */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Settings</Typography>
                                <Typography color="text.secondary">Manage your account.</Typography>
                                <Button variant='contained' color="primary" sx={{ mt: 2, backgroundColor: "black"}} onClick={handleOpen}>
                                    Edit Profile
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* --- Dialog สำหรับ Setting Form --- */}
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Edit Your Profile</DialogTitle>
                    <DialogContent>
                        {/* Render ฟอร์มข้างในนี้ */}
                        <SettingForm currentUser={user} onSubmit={handleSettingsSubmit} onCancel={handleClose} />
                    </DialogContent>
                </Dialog>
                {/* --- สิ้นสุด Dialog --- */}
            </Container>
        </>
    );
}

export default AboutMe;