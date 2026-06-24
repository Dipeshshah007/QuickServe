const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  menuItem:   { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  name:       { type: String, required: true },
  price:      { type: Number, required: true },
  image:      { type: String },
  quantity:   { type: Number, required: true, min: 1, default: 1 },
  customizations: [{
    group:  { type: String },
    option: { type: String },
    price:  { type: Number, default: 0 },
  }],
  itemTotal: { type: Number, required: true },
});

const cartSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  restaurantName: { type: String },
  items:      [cartItemSchema],
  subtotal:   { type: Number, default: 0 },
}, { timestamps: true });

// Recalculate subtotal before save
cartSchema.pre('save', function (next) {
  this.subtotal = this.items.reduce((sum, item) => sum + item.itemTotal, 0);
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
