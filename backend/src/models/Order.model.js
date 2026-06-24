const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem:     { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  name:         { type: String, required: true },
  price:        { type: Number, required: true },
  quantity:     { type: Number, required: true, min: 1 },
  customizations: [{
    group:  { type: String },
    option: { type: String },
    price:  { type: Number, default: 0 },
  }],
  itemTotal: { type: Number, required: true },
});

const statusHistorySchema = new mongoose.Schema({
  status:    { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  note:      { type: String },
});

const orderSchema = new mongoose.Schema({
  orderNumber:    { type: String, unique: true },
  customer:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant:     { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  items:          [orderItemSchema],
  status: {
    type: String,
    enum: ['pending','confirmed','preparing','out_for_delivery','delivered','cancelled'],
    default: 'pending',
  },
  statusHistory:  [statusHistorySchema],
  deliveryAddress: {
    label:   { type: String },
    street:  { type: String, required: true },
    city:    { type: String, required: true },
    state:   { type: String, required: true },
    zipCode: { type: String, required: true },
  },
  pricing: {
    subtotal:     { type: Number, required: true },
    deliveryFee:  { type: Number, default: 0 },
    taxes:        { type: Number, default: 0 },
    discount:     { type: Number, default: 0 },
    total:        { type: Number, required: true },
  },
  payment: {
    method:        { type: String, enum: ['card','cod','wallet'], default: 'cod' },
    status:        { type: String, enum: ['pending','paid','failed','refunded'], default: 'pending' },
    transactionId: { type: String },
    paidAt:        { type: Date },
  },
  instructions:   { type: String },
  estimatedDelivery: { type: Date },
  deliveredAt:    { type: Date },
  rating: {
    food:     { type: Number, min: 1, max: 5 },
    delivery: { type: Number, min: 1, max: 5 },
    comment:  { type: String },
    ratedAt:  { type: Date },
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Auto-generate order number
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `QS${Date.now().toString().slice(-6)}${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ restaurant: 1, status: 1 });
orderSchema.index({ orderNumber: 1 });

module.exports = mongoose.model('Order', orderSchema);
