const User = require('../models/User.model');
const Restaurant = require('../models/Restaurant.model');
const Order = require('../models/Order.model');
const MenuItem = require('../models/MenuItem.model');

// GET /api/admin/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalRestaurants,
      totalOrders,
      activeOrders,
      revenueData,
    ] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      Restaurant.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.countDocuments({ status: { $in: ['pending', 'confirmed', 'preparing', 'out_for_delivery'] } }),
      Order.aggregate([
        { $match: { status: 'delivered', 'payment.status': 'paid' } },
        { $group: { _id: null, total: { $sum: '$pricing.total' } } },
      ]),
    ]);

    // Orders in last 7 days
    const weeklyOrders = await Order.aggregate([
      { $match: { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
        revenue: { $sum: '$pricing.total' }
      }},
      { $sort: { _id: 1 } },
    ]);

    const recentOrders = await Order.find()
      .populate('customer', 'name email')
      .populate('restaurant', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalRestaurants,
        totalOrders,
        activeOrders,
        totalRevenue: revenueData[0]?.total || 0,
      },
      weeklyOrders,
      recentOrders,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/users
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) filter.$or = [
      { name: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
    ];

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(+limit);

    const total = await User.countDocuments(filter);
    res.json({ success: true, users, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/admin/users/:id/toggle
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
