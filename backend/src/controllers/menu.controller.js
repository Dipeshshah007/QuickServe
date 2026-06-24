const MenuItem = require('../models/MenuItem.model');

// GET /api/menu/restaurant/:restaurantId
exports.getMenuByRestaurant = async (req, res) => {
  try {
    const { category, veg, search } = req.query;
    const filter = { restaurant: req.params.restaurantId, isAvailable: true };

    if (category) filter.category = category;
    if (veg === 'true') filter.isVeg = true;
    if (search) filter.$text = { $search: search };

    const items = await MenuItem.find(filter).sort({ isBestSeller: -1, name: 1 });
    const categories = [...new Set(items.map(i => i.category))];

    res.json({ success: true, items, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/menu/:id
exports.getMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate('restaurant', 'name deliveryInfo');
    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });
    res.json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/menu (admin)
exports.createMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/menu/:id (admin)
exports.updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });
    res.json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/menu/:id (admin)
exports.deleteMenuItem = async (req, res) => {
  try {
    await MenuItem.findByIdAndUpdate(req.params.id, { isAvailable: false });
    res.json({ success: true, message: 'Item removed from menu.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
