const express = require('express');
const { getPayments, addPayment, buyPlan, getInvoice } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.route('/')
    .get(protect, authorize('admin', 'staff'), getPayments)
    .post(protect, authorize('admin', 'staff'), addPayment);

router.post('/buy-plan', protect, authorize('member'), buyPlan);
router.get('/invoice/:id', protect, getInvoice);

module.exports = router;
