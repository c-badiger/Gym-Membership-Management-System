const express = require('express');
const { markAttendance, getMyAttendance, getAllAttendance, markAttendanceAdmin, getAttendanceAdmin } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.post('/mark', protect, authorize('member'), markAttendance);
router.get('/my', protect, authorize('member'), getMyAttendance);
router.get('/all', protect, authorize('admin', 'staff'), getAllAttendance);

router.post('/', protect, authorize('admin', 'staff'), markAttendanceAdmin);
router.get('/', protect, authorize('admin', 'staff'), getAttendanceAdmin);

module.exports = router;
