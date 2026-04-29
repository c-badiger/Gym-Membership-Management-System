const express = require('express');
const { getPlans, addPlan, deletePlan } = require('../controllers/planController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.route('/')
    .get(protect, getPlans)
    .post(protect, addPlan);

router.route('/:id')
    .delete(protect, deletePlan);

module.exports = router;
