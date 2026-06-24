// user.routes.js
const express = require('express');
const userRouter = express.Router();
const { protect } = require('../middleware/auth.middleware');
const User = require('../models/User.model');

userRouter.get('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, user });
});

module.exports = userRouter;
