// payment.routes.js
const express = require('express');
const paymentRouter = express.Router();
const { protect } = require('../middleware/auth.middleware');
const Order = require('../models/Order.model');

// Simulate payment (Stripe integration placeholder)
paymentRouter.post('/create-intent', protect, async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    // In production, use: const paymentIntent = await stripe.paymentIntents.create(...)
    // For demo, we simulate success
    res.json({
      success: true,
      clientSecret: 'demo_client_secret_' + Date.now(),
      amount: order.pricing.total,
      message: 'Payment intent created (demo mode)',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

paymentRouter.post('/confirm', protect, async (req, res) => {
  try {
    const { orderId, transactionId } = req.body;
    const order = await Order.findByIdAndUpdate(
      orderId,
      { 'payment.status': 'paid', 'payment.transactionId': transactionId, 'payment.paidAt': new Date() },
      { new: true }
    );
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = paymentRouter;
