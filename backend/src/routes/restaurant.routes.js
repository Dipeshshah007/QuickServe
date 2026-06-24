const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/restaurant.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/', ctrl.getRestaurants);
router.get('/cuisines/list', ctrl.getCuisines);
router.get('/:id', ctrl.getRestaurant);
router.post('/', protect, authorize('admin'), ctrl.createRestaurant);
router.put('/:id', protect, authorize('admin'), ctrl.updateRestaurant);
router.delete('/:id', protect, authorize('admin'), ctrl.deleteRestaurant);

module.exports = router;
