const express = require('express');
const router = express.Router();
const { summarizePost } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/summarize', protect, summarizePost);

module.exports = router;
