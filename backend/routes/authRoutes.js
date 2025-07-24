const express = require('express');
const router = express.Router();
const {
  sendOtp,
  verifyOtpAndSetPassword,
  login,
  getProfile
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtpAndSetPassword);
router.post('/login', login);

// ✅ Protected route to get student profile
router.get('/me', authMiddleware, getProfile);

// Test route
router.get('/test', (req, res) => {
  res.status(200).send('API is live ✅');
});

module.exports = router;
