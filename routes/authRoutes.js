// routes/authRoutes.js
const express = require('express');
const { registerUser, verifyOtp, resendOtp, checkLoginStatus, LoginOtp } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp',resendOtp)
router.post('/checkLoginStatus',checkLoginStatus)
router.post('/login-otp',LoginOtp)

module.exports = router;
