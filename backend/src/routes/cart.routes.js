const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/cart.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.get('/', ctrl.getCart);
router.post('/add', ctrl.addToCart);
router.put('/item/:itemId', ctrl.updateCartItem);
router.delete('/item/:itemId', ctrl.removeFromCart);
router.delete('/clear', ctrl.clearCart);

module.exports = router;
