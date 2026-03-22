const express = require('express');
const router = express.Router();
const { enroll, getEnrollments } = require('../controllers/enrollmentController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, enroll);
router.get('/my-courses', authenticateToken, getEnrollments);

module.exports = router;
