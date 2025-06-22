const express = require('express');
const bcrypt = require('bcryptjs');
const axios = require("axios");
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Sign up
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) return res.status(400).json({ msg: "❌ Email already registered" });

    const usernameExists = await User.findOne({ username });
    if (usernameExists) return res.status(400).json({ msg: "❌ Username already taken" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashed });
    await user.save();

    res.status(201).json({ msg: "✅ User created successfully" });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Sign in
router.post('/signin', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: "❌ Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "❌ Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user: { id: user._id, username: user.username } });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});


module.exports = router;
