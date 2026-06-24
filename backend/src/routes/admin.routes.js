const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect, authorize('admin'));

router.get('/dashboard', ctrl.getDashboard);
router.get('/users', ctrl.getUsers);
router.put('/users/:id/toggle', ctrl.toggleUserStatus);

module.exports = router;
