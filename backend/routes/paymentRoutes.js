const express = require('express');
const { getPayments, addPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.route('/')
    .get(protect, getPayments)
    .post(protect, addPayment);

module.exports = router;
