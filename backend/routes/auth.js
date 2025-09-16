const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const pool = require('../config/db');
const router = express.Router();

// POST /api/auth/register สมัครสมาชิก
router.post('/register', async (req, res) => {
  const { email, password, displayName } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (email, password, displayName) VALUES (?, ?, ?)',
      [email, hashedPassword, displayName]
    );
    res.status(201).json({ message: 'สร้าง User แล้วงับเตง', userId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error' });
  }
});

// POST /api/auth/login ล็อกอิน
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'ล็อกอินสำเร็จงับเตง', token: `Bearer ${token}` });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/auth/google (เริ่มกระบวนการ OAuth)
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// GET /api/auth/google/callback (หลังจาก User ยินยอมที่หน้า Google)
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    // req.user มาจาก passport strategy
    const payload = { id: req.user.id, email: req.user.email, role: req.user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // --- ส่วนที่แก้ไข ---
    // เปลี่ยนจากการส่ง JSON เป็นการ Redirect ไปที่ Frontend 
    // พร้อมแนบ token ไปใน URL Query Parameter
    res.redirect(`http://localhost:3000/auth/callback?token=${token}`);
  }
);

module.exports = router;