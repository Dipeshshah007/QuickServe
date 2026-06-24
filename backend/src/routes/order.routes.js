const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/order.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/', ctrl.placeOrder);
router.get('/my', ctrl.getMyOrders);
router.get('/admin/all', authorize('admin'), ctrl.getAllOrders);
router.get('/:id', ctrl.getOrder);
router.put('/:id/status', authorize('admin'), ctrl.updateOrderStatus);
router.put('/:id/cancel', ctrl.cancelOrder);
router.post('/:id/rate', ctrl.rateOrder);

module.exports = router;
