const router = require('express').Router();
const { createOrder, getUserOrders, getOrderById, cancelOrder } = require('../controllers/orderController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.post('/',           createOrder);
router.get('/',            getUserOrders);
router.get('/:id',         getOrderById);
router.put('/:id/cancel',  cancelOrder);

module.exports = router;
