const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { requireAuth, requireAdmin } = require('../middlewares/authMiddleware');

// GET /api/products - ดึงข้อมูลสินค้าทั้งหมด
router.get('/', async (req, res) => {
    const { q } = req.query; // ดึงคำค้นหา (q) จาก URL query string

    try {
        let sqlQuery = 'SELECT * FROM products';
        const params = [];

        // ถ้ามีคำค้นหา (q) ส่งมาด้วย
        if (q) {
            sqlQuery += ' WHERE name LIKE ? OR description LIKE ?';
            params.push(`%${q}%`); // ค้นหาคำที่อยู่ใน name
            params.push(`%${q}%`); // หรืออยู่ใน description
        }

        sqlQuery += ' ORDER BY createdAt DESC';

        const [rows] = await pool.query(sqlQuery, params);
        res.json(rows);

    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error while fetching products.' });
    }
});
// GET /api/products/:id - ดึงข้อมูลสินค้าชิ้นเดียว
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params; // ดึง id จาก URL parameter
        const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        
        res.json(rows[0]); // ส่งข้อมูล product แค่ตัวเดียวกลับไป
    } catch (error) {
        console.error('Error fetching single product:', error);
        res.status(500).json({ message: 'Server error while fetching product.' });
    }
});

// --- CREATE ---
// POST /api/products - สร้างสินค้าใหม่ (Admin Only)
router.post('/', requireAuth, requireAdmin, async (req, res) => {
    const { name, description, price, imageUrl } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO products (name, description, price, imageUrl) VALUES (?, ?, ?, ?)',
            [name, description, price, imageUrl]
        );
        res.status(201).json({ id: result.insertId, name, description, price, imageUrl });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// --- UPDATE ---
// PUT /api/products/:id - แก้ไขข้อมูลสินค้า (Admin Only)
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, description, price, imageUrl } = req.body;
    try {
        await pool.query(
            'UPDATE products SET name = ?, description = ?, price = ?, imageUrl = ? WHERE id = ?',
            [name, description, price, imageUrl, id]
        );
        res.json({ message: 'Product updated successfully.' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// --- DELETE ---
// DELETE /api/products/:id - ลบสินค้า (Admin Only)
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM products WHERE id = ?', [id]);
        res.json({ message: 'Product deleted successfully.' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
module.exports = router;