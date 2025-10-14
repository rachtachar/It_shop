const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const pool = require('./db');
require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/google/callback" 
  },
  async (accessToken, refreshToken, profile, done) => {
    const { id, displayName, emails } = profile;
    const email = emails[0].value;

    try {
      // 1. ค้นหา user จาก googleId
      let [rows] = await pool.query('SELECT * FROM users WHERE googleId = ?', [id]);
      let user = rows[0];

      if (user) {
        // 2. ถ้าเจอ ก็ส่ง user กลับไป
        return done(null, user);
      } else {
        // 3. ถ้าไม่เจอ ให้สร้าง user ใหม่
        const [result] = await pool.query(
          'INSERT INTO users (googleId, displayName, email) VALUES (?, ?, ?)',
          [id, displayName, email]
        );
        // ดึงข้อมูล user ที่เพิ่งสร้างใหม่
        [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
        return done(null, rows[0]);
      }
    } catch (err) {
      return done(err, null);
    }
  }
));
// ไม่ต้องใช้ serialize/deserialize เพราะเราใช้ JWT (stateless)
// JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const [rows] = await pool.query('SELECT id, email, role, displayName FROM users WHERE id = ?', [payload.id]);
    const user = rows[0];

    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
}));