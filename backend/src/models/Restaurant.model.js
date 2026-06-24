const mongoose = require('mongoose');

const operatingHoursSchema = new mongoose.Schema({
  day:   { type: String, enum: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] },
  open:  { type: String, default: '09:00' },
  close: { type: String, default: '22:00' },
  closed:{ type: Boolean, default: false },
});

const restaurantSchema = new mongoose.Schema({
  name:            { type: String, required: true, trim: true },
  description:     { type: String, required: true },
  owner:           { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cuisineTypes:    [{ type: String }],
  categories:      [{ type: String }],
  image:           { type: String, default: '' },
  coverImage:      { type: String, default: '' },
  address: {
    street:  { type: String, required: true },
    city:    { type: String, required: true },
    state:   { type: String, required: true },
    zipCode: { type: String, required: true },
    lat:     { type: Number },
    lng:     { type: Number },
  },
  contactPhone:    { type: String },
  contactEmail:    { type: String },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count:   { type: Number, default: 0 },
  },
  deliveryInfo: {
    minOrder:      { type: Number, default: 0 },
    deliveryFee:   { type: Number, default: 0 },
    estimatedTime: { type: String, default: '30-45 min' },
    freeDeliveryAbove: { type: Number, default: 500 },
  },
  operatingHours:  [operatingHoursSchema],
  isActive:        { type: Boolean, default: true },
  isFeatured:      { type: Boolean, default: false },
  tags:            [{ type: String }],
  totalOrders:     { type: Number, default: 0 },
}, { timestamps: true });

restaurantSchema.index({ 'address.city': 1, isActive: 1 });
restaurantSchema.index({ cuisineTypes: 1 });
restaurantSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Restaurant', restaurantSchema);
