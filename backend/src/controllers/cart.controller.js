const Cart = require('../models/Cart.model');
const MenuItem = require('../models/MenuItem.model');

// GET /api/cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('restaurant', 'name image deliveryInfo')
      .populate('items.menuItem', 'name image price isAvailable');
    res.json({ success: true, cart: cart || { items: [], subtotal: 0 } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/cart/add
exports.addToCart = async (req, res) => {
  try {
    const { menuItemId, quantity = 1, customizations = [] } = req.body;

    const menuItem = await MenuItem.findById(menuItemId).populate('restaurant');
    if (!menuItem || !menuItem.isAvailable) {
      return res.status(404).json({ success: false, message: 'Item not available.' });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    // If cart has items from a different restaurant, warn
    if (cart && cart.restaurant && cart.restaurant.toString() !== menuItem.restaurant._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Your cart has items from another restaurant. Clear it first.',
        clearRequired: true,
      });
    }

    const customPrice = customizations.reduce((sum, c) => sum + (c.price || 0), 0);
    const itemPrice = (menuItem.discountedPrice || menuItem.price) + customPrice;
    const itemTotal = itemPrice * quantity;

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        restaurant: menuItem.restaurant._id,
        restaurantName: menuItem.restaurant.name,
        items: [],
      });
    }

    // Check if same item (with same customizations) exists
    const existingIdx = cart.items.findIndex(
      i => i.menuItem.toString() === menuItemId &&
           JSON.stringify(i.customizations) === JSON.stringify(customizations)
    );

    if (existingIdx > -1) {
      cart.items[existingIdx].quantity += quantity;
      cart.items[existingIdx].itemTotal = cart.items[existingIdx].quantity * itemPrice;
    } else {
      cart.items.push({
        menuItem: menuItemId,
        name: menuItem.name,
        price: itemPrice,
        image: menuItem.image,
        quantity,
        customizations,
        itemTotal,
      });
    }

    await cart.save();
    await cart.populate('restaurant', 'name image deliveryInfo');
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/cart/item/:itemId
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found.' });

    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not in cart.' });

    if (quantity <= 0) {
      item.deleteOne();
    } else {
      item.quantity = quantity;
      item.itemTotal = item.price * quantity;
    }

    if (cart.items.length === 0) {
      await Cart.findByIdAndDelete(cart._id);
      return res.json({ success: true, cart: { items: [], subtotal: 0 } });
    }

    await cart.save();
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/cart/item/:itemId
exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found.' });

    cart.items = cart.items.filter(i => i._id.toString() !== req.params.itemId);

    if (cart.items.length === 0) {
      await Cart.findByIdAndDelete(cart._id);
      return res.json({ success: true, cart: { items: [], subtotal: 0 } });
    }

    await cart.save();
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/cart/clear
exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.json({ success: true, message: 'Cart cleared.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
