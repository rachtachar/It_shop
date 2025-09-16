const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// ฟังก์ชันสำหรับหาหรือสร้าง cart_id ของ user
const getOrCreateCart = async (userId) => {
    let [carts] = await pool.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
    if (carts.length > 0) {
        return carts[0].id;
    } else {
        const [result] = await pool.query('INSERT INTO carts (user_id) VALUES (?)', [userId]);
        return result.insertId;
    }
};

// POST /api/cart/add - เพิ่มสินค้าลงตะกร้า
router.post('/add', async (req, res) => {
    const userId = req.user.id; // มาจาก requireAuth middleware
    const { productId, quantity } = req.body;

    try {
        const cartId = await getOrCreateCart(userId);
        
        // เช็คว่ามีสินค้านี้ในตะกร้าแล้วหรือยัง
        const [items] = await pool.query(
            'SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?',
            [cartId, productId]
        );

        if (items.length > 0) {
            // ถ้ามีแล้ว ให้อัปเดต quantity
            const newQuantity = items[0].quantity + quantity;
            await pool.query(
                'UPDATE cart_items SET quantity = ? WHERE id = ?',
                [newQuantity, items[0].id]
            );
        } else {
            // ถ้ายังไม่มี ให้เพิ่มเข้าไปใหม่
            await pool.query(
                'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
                [cartId, productId, quantity]
            );
        }
        res.status(200).json({ message: 'Product added to cart successfully.' });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/cart - ดูสินค้าทั้งหมดในตะกร้า
router.get('/', async (req, res) => {
    const userId = req.user.id;
    try {
        const [carts] = await pool.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
        if (carts.length === 0) {
            return res.json([]); // ถ้ายังไม่มีตะกร้า ก็ส่ง array ว่างกลับไป
        }
        const cartId = carts[0].id;

        const [items] = await pool.query(`
            SELECT 
                ci.product_id AS productId,
                ci.quantity,
                p.name,
                p.price,
                p.imageUrl
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.cart_id = ?
        `, [cartId]);
        
        res.json(items);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/cart/item/:productId - ลบสินค้าออกจากตะกร้า
router.delete('/item/:productId', async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.params;

    try {
        // 1. หา cart_id ของ user คนนี้
        const [carts] = await pool.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
        if (carts.length === 0) {
            return res.status(404).json({ message: 'Cart not found.' });
        }
        const cartId = carts[0].id;

        // 2. ทำการลบ item ออกจากตาราง cart_items
        const [result] = await pool.query(
            'DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?',
            [cartId, productId]
        );

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Item removed from cart successfully.' });
        } else {
            res.status(404).json({ message: 'Item not found in cart.' });
        }
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;