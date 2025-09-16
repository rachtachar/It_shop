const passport = require('passport');

// Middleware สำหรับยืนยันตัวตน (Authentication) ผ่าน JWT
const requireAuth = passport.authenticate('jwt', { session: false });

// Middleware สำหรับตรวจสอบสิทธิ์ (Authorization) ว่าเป็น Admin หรือไม่
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // ถ้าเป็น admin ให้ไปต่อ
  } else {
    res.status(403).json({ message: 'Forbidden: Admins only' }); // ถ้าไม่ใช่ ให้ส่ง error
  }
};

module.exports = {
  requireAuth,
  requireAdmin,
};