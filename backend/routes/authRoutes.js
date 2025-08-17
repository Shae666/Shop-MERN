const express = require('express');
const User = require('../models/User');
const router = express.Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register new user with optional admin role
 */
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, secretKey } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Determine role based on secret key
    let role = "user";
    if (secretKey && secretKey === process.env.ADMIN_SECRET_KEY) {
      role = "admin";
    }

    // Create and save new user
    const newUser = new User({ name, email, password, wishlist: [], role });
    await newUser.save();

    // Return user object along with message
    res.status(201).json({ 
      message: "User registered successfully", 
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        wishlist: newUser.wishlist,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

/**
 * @route   POST /api/auth/signin
 * @desc    Log in existing user
 */
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check password (plain text for now)
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Return user object along with message
    res.status(200).json({ 
      message: "Login successful", 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        wishlist: user.wishlist,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
