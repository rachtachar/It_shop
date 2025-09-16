import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
    Container, 
    Typography, 
    Box, 
    CircularProgress, 
    List, 
    ListItem, 
    ListItemText, 
    ListItemAvatar, 
    Avatar,
    Divider,
    Paper,
    Button,
    IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Navbar from '../components/Navbar';

function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchCartItems = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                setLoading(true);
                const res = await axios.get('http://localhost:5000/api/cart', {
                    headers: { Authorization: token }
                });
                

                setCartItems(res.data);
            } catch (error) {
                console.error('Failed to fetch cart:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, [navigate]);

    const handleRemoveItem = async (productId) => {
        try {
            await axios.delete(`http://localhost:5000/api/cart/item/${productId}`, {
                headers: { Authorization: token }
            });
            // อัปเดต state โดยการกรองเอาสินค้าที่ถูกลบออกไป
            setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
        } catch (error) {
            console.error('Failed to remove item from cart:', error);
            alert('Could not remove item from cart.');
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>;
    }

    

    return (
        <>
            <Navbar />
        <Container sx={{ py: 4 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1  )}
                sx={{ mb: 2 }}
            >
                Back to Shop
            </Button>
            <Typography variant="h4" gutterBottom>Your Shopping Cart</Typography>
            {cartItems.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6">Your cart is empty.</Typography>
                    <Button component={RouterLink} to="/dashboard" variant="contained" sx={{ mt: 2 }}>
                        Continue Shopping
                    </Button>
                </Paper>
            ) : (
                <Paper>
                    <List>
                        {cartItems.map((item) => (
                            <React.Fragment key={item.productId}>
                                <ListItem
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveItem(item.productId)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar variant="square" src={item.imageUrl} sx={{ width: 60, height: 60, mr: 2 }} />
                                    </ListItemAvatar>
                                    <ListItemText 
                                        primary={item.name}
                                        secondary={`Quantity: ${item.quantity}`}
                                    />
                                    <Typography variant="body1">฿{(item.price * item.quantity).toFixed(2)}</Typography>
                                </ListItem>
                                <Divider component="li" />
                            </React.Fragment>
                        ))}
                        <ListItem>
                            <ListItemText primary={<Typography variant="h6">Total</Typography>} />
                            <Typography variant="h6">฿{calculateTotal()}</Typography>
                        </ListItem>
                    </List>
                </Paper>
            )}
        </Container>
         </>
    );
   
}

export default CartPage;