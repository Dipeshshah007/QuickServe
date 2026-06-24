const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  label:    { type: String, default: 'Home' },
  street:   { type: String, required: true },
  city:     { type: String, required: true },
  state:    { type: String, required: true },
  zipCode:  { type: String, required: true },
  lat:      { type: Number },
  lng:      { type: Number },
  isDefault:{ type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  email:         { type: String, required: true, unique: true, lowercase: true },
  password:      { type: String, required: true, minlength: 6, select: false },
  phone:         { type: String },
  role:          { type: String, enum: ['customer', 'admin', 'restaurant_owner'], default: 'customer' },
  avatar:        { type: String, default: '' },
  addresses:     [addressSchema],
  isActive:      { type: Boolean, default: true },
  isVerified:    { type: Boolean, default: false },
  favoriteItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }],
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
