import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { 
    Container, 
    Typography, 
    Box, 
    CircularProgress, 
    Button,
    Grid,
    Breadcrumbs,
    Link,
    Snackbar,
    Alert,
    IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function ProductDetailPage() {
    const { id } = useParams(); // ดึง id ของสินค้าจาก URL
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                setLoading(true);
                const res = await axios.get(`http://localhost:5000/api/products/${id}`, {
                    headers: { Authorization: token }
                });
                
                setProduct(res.data);
            } catch (error) {
                console.error('Failed to fetch product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, navigate]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!product) {
        return (
            <Container sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="h4">Product Not Found</Typography>
                <Button component={RouterLink} to="/dashboard" sx={{ mt: 2 }}>
                    Back to Products
                </Button>
            </Container>
        );
    }
    const handleAddToCart = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:5000/api/cart/add', 
                { productId: id, quantity: 1 }, // ตอนนี้เพิ่มทีละ 1 ชิ้น
                { headers: { Authorization: token } }
            );
            setOpenSnackbar(true); // แสดง Snackbar เมื่อสำเร็จ
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add product to cart.');
        }
    };

    return (
        <Container sx={{ py: 4 }}>
            <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
                    <ArrowBackIcon />
            </IconButton>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
                <Link component={RouterLink} underline="hover" color="inherit" to="/dashboard">
                    Products
                </Link>
                <Typography color="text.primary">{product.name}</Typography>
            </Breadcrumbs>

            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Box 
                        component="img"
                        sx={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: 2,
                            boxShadow: 3
                        }}
                        src={product.imageUrl || 'https://via.placeholder.com/600'}
                        alt={product.name}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h3" component="h1" gutterBottom>
                        {product.name}
                    </Typography>
                    <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
                        ฿{product.price}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        {product.description}
                    </Typography>
                    <Button variant="contained" size="large" sx={{ mt: 2 }} onClick={handleAddToCart}>
                        Add to Cart
                    </Button>
                    <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
                        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                            Product added to cart!
                        </Alert>
                    </Snackbar>
                </Grid>
            </Grid>
        </Container>
    );
}


export default ProductDetailPage;