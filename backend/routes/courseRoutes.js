const express = require('express');
const router = express.Router();
const {
    getSubjects, createSubject, updateSubject, deleteSubject,
    getSectionsBySubject, createSection,
    getVideosBySection, createVideo
} = require('../controllers/courseController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Public or student-accessible
router.get('/subjects', getSubjects);
router.get('/subjects/:subjectId/sections', getSectionsBySubject);
router.get('/sections/:sectionId/videos', getVideosBySection);

// Admin-only
router.post('/subjects', authenticateToken, authorizeRoles('Admin'), createSubject);
router.put('/subjects/:id', authenticateToken, authorizeRoles('Admin'), updateSubject);
router.delete('/subjects/:id', authenticateToken, authorizeRoles('Admin'), deleteSubject);

router.post('/sections', authenticateToken, authorizeRoles('Admin'), createSection);
router.post('/videos', authenticateToken, authorizeRoles('Admin'), createVideo);

module.exports = router;
