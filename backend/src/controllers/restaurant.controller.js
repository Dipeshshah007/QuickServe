const Restaurant = require('../models/Restaurant.model');
const MenuItem = require('../models/MenuItem.model');

// GET /api/restaurants
exports.getRestaurants = async (req, res) => {
  try {
    const { cuisine, search, city, featured, page = 1, limit = 12 } = req.query;
    const filter = { isActive: true };

    if (cuisine) filter.cuisineTypes = { $in: [cuisine] };
    if (city)    filter['address.city'] = new RegExp(city, 'i');
    if (featured === 'true') filter.isFeatured = true;
    if (search)  filter.$text = { $search: search };

    const skip = (page - 1) * limit;
    const [restaurants, total] = await Promise.all([
      Restaurant.find(filter).sort({ isFeatured: -1, 'rating.average': -1 }).skip(skip).limit(+limit),
      Restaurant.countDocuments(filter),
    ]);

    res.json({
      success: true,
      restaurants,
      pagination: { total, page: +page, limit: +limit, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/restaurants/:id
exports.getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found.' });

    const menuItems = await MenuItem.find({ restaurant: restaurant._id, isAvailable: true })
      .sort({ isBestSeller: -1, category: 1 });

    // Group by category
    const menu = menuItems.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});

    res.json({ success: true, restaurant, menu });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/restaurants/cuisines/list
exports.getCuisines = async (req, res) => {
  try {
    const cuisines = await Restaurant.distinct('cuisineTypes', { isActive: true });
    res.json({ success: true, cuisines });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/restaurants (admin)
exports.createRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json({ success: true, restaurant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/restaurants/:id (admin)
exports.updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found.' });
    res.json({ success: true, restaurant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/restaurants/:id (admin)
exports.deleteRestaurant = async (req, res) => {
  try {
    await Restaurant.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Restaurant deactivated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
