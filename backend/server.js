const express = require('express');
const cors = require('cors');
const passport = require('passport');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products'); 
const { requireAuth, requireAdmin } = require('./middlewares/authMiddleware');
const cartRoutes = require('./routes/cart');

const app = express();

// --- Middlewares ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
require('./config/passport');

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', requireAuth, cartRoutes);

// Route สำหรับดึงข้อมูลโปรไฟล์ผู้ใช้ (ต้อง Login)
app.get('/api/profile', requireAuth, (req, res) => {
    // เราจะเก็บไว้แค่ Route นี้อันเดียวพอ
    res.json({
        message: 'Welcome to your profile!',
        user: req.user 
    });
});

app.put ('/api/profile', requireAuth, async (req, res) => {
    const { displayName } = req.body;
    const userId = req.user.id;

    try {   
        const pool = require('./config/db');
        await pool.query('UPDATE users SET displayName = ? WHERE id = ?', [displayName, userId]);
        const [rows] = await pool.query('SELECT id, email, displayName, role FROM users WHERE id = ?', [userId]);
        res.json({ message: 'Profile updated', user: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});



// Route สำหรับ Admin เท่านั้น
app.get('/api/admin/dashboard', requireAuth, requireAdmin, (req, res) => {
    res.json({
        message: 'Welcome to the Admin Dashboard!',
        adminUser: req.user
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));