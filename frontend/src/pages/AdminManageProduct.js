import React, { useState, useEffect, useCallback } from 'react'; // 1. Import useCallback
import axios from 'axios';
import {
    Container,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogContent,
    Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ProductForm from '../components/ProductForm';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';


function AdminDashboard() {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [open, setOpen] = useState(false);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    // 2. ครอบ fetchProducts ด้วย useCallback
    const fetchProducts = useCallback(async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/products', {
                headers: { Authorization: token }
            });
            

            setProducts(res.data);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    }, [token]); // 3. กำหนดให้ token เป็น dependency ของ useCallback

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]); // 4. เพิ่ม fetchProducts เข้าไปใน dependency ของ useEffect

    const handleOpen = (product = null) => {
        setEditingProduct(product);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingProduct(null);
    };

    const handleFormSubmit = async (productData) => {
        try {
            if (editingProduct) {
                // Update
                await axios.put(`http://localhost:5000/api/products/${editingProduct.id}`, productData, {
                    headers: { Authorization: token }
                });
            } else {
                // Create
                await axios.post('http://localhost:5000/api/products', productData, {
                    headers: { Authorization: token }
                });
            }
            fetchProducts(); // โหลดข้อมูลใหม่
            handleClose(); // ปิดฟอร์ม
        } catch (error) {
            console.error('Failed to submit product:', error);
        }
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`http://localhost:5000/api/products/${productId}`, {
                    headers: { Authorization: token }
                });
                fetchProducts(); // โหลดข้อมูลใหม่
            } catch (error) {
                console.error('Failed to delete product:', error);
            }
        }
    };

    // ... (ส่วน return JSX เหมือนเดิม)
    return (
        <Container sx={{ py: 4 }}>
            <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Grid item>
                    <Typography variant="h4" gutterBottom>
                        Admin: Manage Products
                    </Typography>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        onClick={() => handleOpen()}
                        sx={{ backgroundColor: 'black', ":hover": { backgroundColor: '#333' } }}
                    >
                        Add New Product
                    </Button>
                </Grid>
            </Grid>

            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/aboutme')}
                color='black'
                sx={{ mb: 2 }}
            >
                Back
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell align="right">฿{product.price}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleOpen(product)}><EditIcon /></IconButton>
                                    <IconButton onClick={() => handleDelete(product.id)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog for Create/Edit Form */}
            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    <ProductForm onSubmit={handleFormSubmit} initialData={editingProduct || {}} onCancel={handleClose}/>
                </DialogContent>
            </Dialog>
        </Container>
    );
}

export default AdminDashboard;