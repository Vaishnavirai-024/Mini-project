const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, plan: user.plan, credits: user.credits, analysisHistory: user.analysisHistory || [] },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Demo account fallback (works without MongoDB)
    if (email === 'demo@resumeai.com' && password === '123456') {
      const token = jwt.sign(
        { id: 'demo-user-id', email: 'demo@resumeai.com' },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '7d' }
      );
      return res.json({
        success: true,
        token,
        user: { id: 'demo-user-id', name: 'Demo User', email: 'demo@resumeai.com', plan: 'pro', credits: 0, analysisHistory: [] },
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, plan: user.plan, credits: user.credits, analysisHistory: user.analysisHistory || [] },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    // Fetch user with analysisHistory included for dashboard/history views
    const user = await User.findById(userId)
      .select('+analysisHistory')
      .lean();
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      plan: user.plan,
      credits: user.credits,
      analysisHistory: Array.isArray(user.analysisHistory) ? user.analysisHistory : []
    };

    res.json({ 
      success: true, 
      data: userData,
      user: userData // Also include user for backward compatibility
    });
  } catch (error) {
    console.error('Error in getMe:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login, getMe };
