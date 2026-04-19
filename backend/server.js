require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Import routes
const authRoutes        = require('./src/routes/auth');
const productRoutes     = require('./src/routes/products');
const categoryRoutes    = require('./src/routes/categories');
const brandRoutes       = require('./src/routes/brands');
const cartRoutes        = require('./src/routes/cart');
const orderRoutes       = require('./src/routes/orders');
const reviewRoutes      = require('./src/routes/reviews');
const voucherRoutes     = require('./src/routes/vouchers');
const wishlistRoutes    = require('./src/routes/wishlist');
const warrantyRoutes    = require('./src/routes/warranty');
const notifRoutes       = require('./src/routes/notifications');
const adminRoutes       = require('./src/routes/admin');

// Import middleware
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================================
// MIDDLEWARE SETUP
// ============================================================
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================================
// API ROUTES
// ============================================================
const API = '/api';

app.use(`${API}/auth`,          authRoutes);
app.use(`${API}/products`,      productRoutes);
app.use(`${API}/categories`,    categoryRoutes);
app.use(`${API}/brands`,        brandRoutes);
app.use(`${API}/cart`,          cartRoutes);
app.use(`${API}/orders`,        orderRoutes);
app.use(`${API}/reviews`,       reviewRoutes);
app.use(`${API}/vouchers`,      voucherRoutes);
app.use(`${API}/wishlist`,      wishlistRoutes);
app.use(`${API}/warranty`,      warrantyRoutes);
app.use(`${API}/notifications`, notifRoutes);
app.use(`${API}/admin`,         adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'TechStore API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use(errorHandler);

// ============================================================
// START SERVER
// ============================================================
app.listen(PORT, () => {
  console.log(`\n🚀 TechStore Backend đang chạy tại http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Môi trường: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;
