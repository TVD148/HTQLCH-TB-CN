/**
 * Database config — đảm bảo utf8mb4 cho mọi query
 */
const mysql = require('mysql2');
require('dotenv').config();

const rawPool = mysql.createPool({
  host:            process.env.DB_HOST     || 'localhost',
  port:            parseInt(process.env.DB_PORT) || 3306,
  user:            process.env.DB_USER     || 'root',
  password:        process.env.DB_PASSWORD || '',
  database:        process.env.DB_NAME     || 'htqlch_thietbi_cn',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  timezone:           '+07:00',
});

// Ép SET NAMES utf8mb4 trên mỗi connection mới
rawPool.on('connection', (conn) => {
  conn.query('SET NAMES utf8mb4');
});

const pool = rawPool.promise();

// Test kết nối
pool.query('SET NAMES utf8mb4; SELECT 1')
  .catch(() => pool.query('SELECT 1'))
  .then(() => console.log('✅ MySQL ready (utf8mb4)'))
  .catch(err => { console.error('❌ MySQL:', err.message); process.exit(1); });

module.exports = pool;
