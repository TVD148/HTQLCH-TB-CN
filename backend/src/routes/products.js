const router = require('express').Router();
const { getProducts, getProductBySlug, compareProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { verifyToken } = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Public routes
router.get('/',          getProducts);
router.get('/compare',   compareProducts);
router.get('/:slug',     getProductBySlug);

// Admin routes
router.post('/',      verifyToken, authorize('admin'), createProduct);
router.put('/:id',    verifyToken, authorize('admin'), updateProduct);
router.delete('/:id', verifyToken, authorize('admin'), deleteProduct);

module.exports = router;
