// ===== routes/authRoutes.js =====
const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');
const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  handleValidationErrors
} = require('../middleware/validation');

const router = express.Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for auth routes
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 password reset requests per hour
  message: {
    success: false,
    message: 'Too many password reset attempts, please try again later.'
  }
});

// Public routes
router.post('/register', authLimiter, validateRegister, handleValidationErrors, register);
router.post('/login', authLimiter, validateLogin, handleValidationErrors, login);
router.post('/forgot-password', passwordResetLimiter, validateForgotPassword, handleValidationErrors, forgotPassword);
router.post('/reset-password/:token', authLimiter, validateResetPassword, handleValidationErrors, resetPassword);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

// Health check for auth service
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Auth service is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;