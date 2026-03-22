const express = require('express');
const router = express.Router();
const { saveProgress, getProgress, getCourseProgress } = require('../controllers/progressController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, saveProgress);
router.get('/:videoId', authenticateToken, getProgress);
router.get('/course/:subjectId', authenticateToken, getCourseProgress);

module.exports = router;
