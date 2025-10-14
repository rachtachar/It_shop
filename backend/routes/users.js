const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const { requireAdmin } = require('../middlewares/authMiddleware'); // <-- Import requireAdmin


// --- ROUTES FOR ADMIN ONLY ---

// GET /api/users - ดึงข้อมูลผู้ใช้ทั้งหมด (Admin Only)
router.get('/', requireAdmin, async (req, res) => {
    try {
        // ไม่ดึงข้อมูลของ admin ที่กำลังล็อกอินอยู่
        const [rows] = await pool.query('SELECT id, email, displayName, role, createdAt FROM users WHERE id != ?', [req.user.id]);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/users/:id/role - อัปเดต Role ของผู้ใช้ (Admin Only)
router.put('/:id/role', requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || (role !== 'admin' && role !== 'user')) {
        return res.status(400).json({ message: 'Invalid role specified.' });
    }

    try {
        await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
        res.json({ message: 'User role updated successfully.' });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/users/:id - ลบผู้ใช้ (Admin Only)
router.delete('/:id', requireAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;