import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';

function ProductForm({ onSubmit, initialData = {} }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        // ถ้ามี initialData (ตอนแก้ไข) ให้ set ค่าเริ่มต้น
        if (initialData) {
            setName(initialData.name || '');
            setDescription(initialData.description || '');
            setPrice(initialData.price || '');
            setImageUrl(initialData.imageUrl || '');
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, description, price: parseFloat(price), imageUrl });
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h6">{initialData.id ? 'Edit Product' : 'Create New Product'}</Typography>
            <TextField margin="normal" required fullWidth label="Product Name" value={name} onChange={e => setName(e.target.value)} />
            <TextField margin="normal" required fullWidth multiline rows={4} label="Description" value={description} onChange={e => setDescription(e.target.value)} />
            <TextField margin="normal" required fullWidth type="number" label="Price" value={price} onChange={e => setPrice(e.target.value)} />
            <TextField margin="normal" fullWidth label="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
                {initialData.id ? 'Save Changes' : 'Create Product'}
            </Button>
        </Box>
    );
}

export default ProductForm;