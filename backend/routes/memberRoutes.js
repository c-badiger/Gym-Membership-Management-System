const express = require('express');
const { getMembers, addMember, updateMember, deleteMember, getMemberProfile, assignFeatures } = require('../controllers/memberController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.route('/')
    .get(protect, authorize('admin', 'staff'), getMembers)
    .post(protect, authorize('admin', 'staff'), addMember);

router.get('/profile', protect, authorize('member'), getMemberProfile);

router.route('/:id')
    .put(protect, authorize('admin', 'staff'), updateMember)
    .delete(protect, authorize('admin', 'staff'), deleteMember);

router.post('/:id/assign', protect, authorize('admin', 'staff'), assignFeatures);

module.exports = router;
