// ── menu.routes.js ──────────────────────────────────────────────────────────
const express = require('express');
const menuRouter = express.Router();
const menuCtrl = require('../controllers/menu.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

menuRouter.get('/restaurant/:restaurantId', menuCtrl.getMenuByRestaurant);
menuRouter.get('/:id', menuCtrl.getMenuItem);
menuRouter.post('/', protect, authorize('admin'), menuCtrl.createMenuItem);
menuRouter.put('/:id', protect, authorize('admin'), menuCtrl.updateMenuItem);
menuRouter.delete('/:id', protect, authorize('admin'), menuCtrl.deleteMenuItem);

module.exports = menuRouter;
