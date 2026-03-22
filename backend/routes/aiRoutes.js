const express = require('express');
const router = express.Router();
const { askAI } = require('../controllers/aiController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/chat', authenticateToken, askAI);

module.exports = router;
