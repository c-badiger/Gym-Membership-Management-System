const express = require('express');
const { login, signup, sendOtp, verifyOtp, resetPassword, memberLogin, memberRegister } = require('../controllers/authController');
const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.post('/member-login', memberLogin);
router.post('/member-register', memberRegister);

module.exports = router;
