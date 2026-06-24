const Order = require('../models/Order.model');
const Cart = require('../models/Cart.model');
const Restaurant = require('../models/Restaurant.model');

// POST /api/orders  — place order from cart
exports.placeOrder = async (req, res) => {
  try {
    const { deliveryAddress, paymentMethod, instructions } = req.body;
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.menuItem');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty.' });
    }

    const restaurant = await Restaurant.findById(cart.restaurant);
    const deliveryFee = restaurant.deliveryInfo.deliveryFee || 0;
    const subtotal = cart.subtotal;
    const taxes = Math.round(subtotal * 0.05 * 100) / 100;
    const total = subtotal + deliveryFee + taxes;

    const order = await Order.create({
      customer: req.user._id,
      restaurant: cart.restaurant,
      items: cart.items.map(i => ({
        menuItem:       i.menuItem._id,
        name:           i.name,
        price:          i.price,
        quantity:       i.quantity,
        customizations: i.customizations,
        itemTotal:      i.itemTotal,
      })),
      deliveryAddress,
      pricing: { subtotal, deliveryFee, taxes, total },
      payment: { method: paymentMethod || 'cod', status: paymentMethod === 'cod' ? 'pending' : 'pending' },
      instructions,
      statusHistory: [{ status: 'pending', note: 'Order placed' }],
      estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000),
    });

    // Clear cart
    await Cart.findOneAndDelete({ user: req.user._id });

    // Update restaurant order count
    await Restaurant.findByIdAndUpdate(cart.restaurant, { $inc: { totalOrders: 1 } });

    await order.populate(['customer', 'restaurant']);
    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/orders — my orders
exports.getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = { customer: req.user._id };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('restaurant', 'name image address')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(+limit);

    const total = await Order.countDocuments(filter);
    res.json({ success: true, orders, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/orders/:id
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('restaurant', 'name image address contactPhone')
      .populate('customer', 'name email phone');

    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    // Only customer or admin can view
    if (order.customer._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden.' });
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/orders/:id/status (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    order.status = status;
    order.statusHistory.push({ status, note });
    if (status === 'delivered') order.deliveredAt = new Date();
    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/orders/:id/cancel
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    if (order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden.' });
    }
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage.' });
    }

    order.status = 'cancelled';
    order.statusHistory.push({ status: 'cancelled', note: 'Cancelled by customer' });
    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/orders/:id/rate
exports.rateOrder = async (req, res) => {
  try {
    const { food, delivery, comment } = req.body;
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, customer: req.user._id, status: 'delivered' },
      { rating: { food, delivery, comment, ratedAt: new Date() } },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found or not delivered.' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/orders/admin/all (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, restaurant } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (restaurant) filter.restaurant = restaurant;

    const orders = await Order.find(filter)
      .populate('customer', 'name email phone')
      .populate('restaurant', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(+limit);

    const total = await Order.countDocuments(filter);
    res.json({ success: true, orders, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
