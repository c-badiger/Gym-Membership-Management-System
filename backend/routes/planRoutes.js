const express = require('express');
const { getPlans, addPlan, deletePlan } = require('../controllers/planController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.route('/')
    .get(protect, getPlans)
    .post(protect, authorize('admin', 'staff'), addPlan);

router.route('/:id')
    .delete(protect, authorize('admin', 'staff'), deletePlan);

module.exports = router;
