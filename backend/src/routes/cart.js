const router = require('express').Router();
const { getCart, addToCart, updateCartItem, removeCartItem, clearCart, applyVoucher } = require('../controllers/cartController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken); // Tất cả cart routes cần đăng nhập

router.get('/',             getCart);
router.post('/add',         addToCart);
router.put('/items/:id',    updateCartItem);
router.delete('/items/:id', removeCartItem);
router.delete('/clear',     clearCart);
router.post('/apply-voucher', applyVoucher);

module.exports = router;
