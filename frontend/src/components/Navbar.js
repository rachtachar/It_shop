import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { getUserFromToken } from '../utils/auth';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const user = getUserFromToken();

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component={RouterLink} to="/dashboard" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
                    ShopIT
                </Typography>
                <IconButton component={RouterLink} to="/cart" color="inherit">
                    <ShoppingCartIcon />
                </IconButton>
                {user && user.role === 'admin' && (
                    <IconButton component={RouterLink} to="/admin" color="inherit" >
                        <AdminPanelSettingsIcon />
                    </IconButton>
                )}
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
                
            </Toolbar>
        </AppBar>
    );
}
export default Navbar;