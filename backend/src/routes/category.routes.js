const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant.model');

router.get('/', async (req, res) => {
  try {
    const categories = [
      { id: 'pizza',    name: 'Pizza',     icon: '🍕', color: '#FF6B35' },
      { id: 'burger',   name: 'Burgers',   icon: '🍔', color: '#F7931E' },
      { id: 'sushi',    name: 'Sushi',     icon: '🍣', color: '#E91E8C' },
      { id: 'chinese',  name: 'Chinese',   icon: '🥡', color: '#4ECDC4' },
      { id: 'indian',   name: 'Indian',    icon: '🍛', color: '#FF9800' },
      { id: 'mexican',  name: 'Mexican',   icon: '🌮', color: '#8BC34A' },
      { id: 'italian',  name: 'Italian',   icon: '🍝', color: '#F44336' },
      { id: 'thai',     name: 'Thai',      icon: '🍜', color: '#9C27B0' },
      { id: 'desserts', name: 'Desserts',  icon: '🍰', color: '#E91E63' },
      { id: 'drinks',   name: 'Drinks',    icon: '🥤', color: '#2196F3' },
      { id: 'healthy',  name: 'Healthy',   icon: '🥗', color: '#4CAF50' },
      { id: 'bbq',      name: 'BBQ',       icon: '🔥', color: '#795548' },
    ];
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
