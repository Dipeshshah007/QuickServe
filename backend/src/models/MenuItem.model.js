const mongoose = require('mongoose');

const customizationOptionSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  price:    { type: Number, default: 0 },
  isDefault:{ type: Boolean, default: false },
});

const customizationGroupSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  required:  { type: Boolean, default: false },
  multiSelect:{ type: Boolean, default: false },
  options:   [customizationOptionSchema],
});

const menuItemSchema = new mongoose.Schema({
  restaurant:       { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  category:         { type: String, required: true },
  name:             { type: String, required: true, trim: true },
  description:      { type: String },
  price:            { type: Number, required: true, min: 0 },
  discountedPrice:  { type: Number },
  image:            { type: String, default: '' },
  isVeg:            { type: Boolean, default: false },
  isVegan:          { type: Boolean, default: false },
  isGlutenFree:     { type: Boolean, default: false },
  spiceLevel:       { type: String, enum: ['mild', 'medium', 'hot', 'extra_hot'], default: 'mild' },
  calories:         { type: Number },
  customizations:   [customizationGroupSchema],
  isAvailable:      { type: Boolean, default: true },
  isBestSeller:     { type: Boolean, default: false },
  isFeatured:       { type: Boolean, default: false },
  rating: {
    average: { type: Number, default: 0 },
    count:   { type: Number, default: 0 },
  },
  tags:             [{ type: String }],
  preparationTime:  { type: Number, default: 15 },
}, { timestamps: true });

menuItemSchema.index({ restaurant: 1, category: 1, isAvailable: 1 });
menuItemSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('MenuItem', menuItemSchema);
