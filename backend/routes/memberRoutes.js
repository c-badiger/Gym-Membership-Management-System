const express = require('express');
const { getMembers, addMember, updateMember, deleteMember } = require('../controllers/memberController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.route('/')
    .get(protect, getMembers)
    .post(protect, addMember);

router.route('/:id')
    .put(protect, updateMember)
    .delete(protect, deleteMember);

module.exports = router;
