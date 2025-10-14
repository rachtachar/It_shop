// backend/config/db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST, // 'database'
  user: process.env.DB_USER, // 'root'
  password: process.env.DB_PASSWORD, // your_strong_root_password
  database: process.env.DB_NAME, // 'it_shop_db'
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;