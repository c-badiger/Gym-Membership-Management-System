const express = require('express');
const { getTrainers, getWorkoutPlans, getDietPlans, getNotifications } = require('../controllers/featuresController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.get('/trainers', protect, getTrainers);
router.get('/workout-plans', protect, getWorkoutPlans);
router.get('/diet-plans', protect, getDietPlans);
router.get('/notifications', protect, authorize('member'), getNotifications);

module.exports = router;
