const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Contract = require('../models/Contract');
const Payment = require('../models/Payment');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Helper: generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate input
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password, and role are required.' });
    }

    // Validate role
    if (!['admin', 'client', 'freelancer'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role selected.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    // Create user (password will be hashed by pre-save hook)
    const user = await User.create({ email, password, role });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: `Duplicate key error: ${JSON.stringify(error.keyValue)}` });
    }
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user and return token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged-in user
// @access  Protected
router.get('/me', protect, async (req, res) => {
  try {
    res.status(200).json({
      user: {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// @route   GET /api/auth/stats
// @desc    Get real-time stats for the dashboard
// @access  Protected
router.get('/stats', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    let stats = {};

    if (req.user.role === 'freelancer') {
      const activeGigs = await Contract.countDocuments({ 
        freelancer: userId, 
        status: { $in: ['active', 'submitted'] } 
      });

      const pendingOffers = await Contract.countDocuments({ 
        freelancer: userId, 
        status: 'pending_approval' 
      });

      const completedContracts = await Contract.countDocuments({ 
        freelancer: userId, 
        status: 'completed' 
      });

      const earningsData = await Payment.aggregate([
        { $match: { payee: userId, type: 'release', status: 'success' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      const totalEarned = earningsData.length > 0 ? earningsData[0].total : 0;

      stats = { activeGigs, pendingOffers, completedContracts, totalEarned };
    } else if (req.user.role === 'client') {
      const activeProjects = await Contract.countDocuments({ 
        user: userId, 
        status: { $in: ['active', 'submitted'] } 
      });

      const totalSpentData = await Payment.aggregate([
        { $match: { payer: userId, type: 'escrow', status: 'success' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      const totalSpent = totalSpentData.length > 0 ? totalSpentData[0].total : 0;

      const milestonesAwaiting = await Contract.countDocuments({
        user: userId,
        'milestones.status': 'submitted',
      });

      stats = { activeProjects, totalSpent, milestonesAwaiting };
    }

    res.status(200).json({ stats });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Server error fetching stats.' });
  }
});

module.exports = router;
