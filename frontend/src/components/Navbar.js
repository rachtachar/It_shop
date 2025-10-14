import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { getUserFromToken } from '../utils/auth';

function Navbar() {
    const navigate = useNavigate();
    const user = getUserFromToken();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        // 1. เปลี่ยน AppBar ให้มีพื้นหลังสีเทาเข้ม
        <AppBar position="static" sx={{ backgroundColor: '#1e1e1e' }}>
            <Toolbar>
                <Typography 
                    variant="h6" 
                    component={RouterLink} 
                    to="/dashboard" 
                    sx={{ textDecoration: 'none', color: 'inherit' }}
                >
                    ShopIT
                </Typography>

                {/* 2. จัดวางไอคอนและปุ่มไปทางขวา */}
                <Box sx={{ flexGrow: 1 }} />
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {/* 3. เพิ่มข้อความต้อนรับ */}
                    {user && (
                        <Typography sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
                            Welcome, {user.displayName || user.email}
                        </Typography>
                    )}
                    
                    <IconButton component={RouterLink} to="/cart" color="inherit">
                        <ShoppingCartIcon />
                    </IconButton>

                    <IconButton component={RouterLink} to="/aboutme" color="inherit">
                        <AccountCircleIcon />
                    </IconButton>

                    {/* 4. ปรับปุ่ม Logout ให้ดูเด่นขึ้น */}
                    <Button 
                        color="inherit" 
                        onClick={handleLogout}
                        variant="outlined" // เพิ่มขอบให้ปุ่ม
                        sx={{ ml: 2, borderColor: 'rgba(255, 255, 255, 0.5)' }}
                    >
                        Logout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;