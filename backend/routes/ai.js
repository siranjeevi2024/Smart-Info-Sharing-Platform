const express = require('express');
const router = express.Router();
const { summarizePost, assistWriting } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/summarize', protect, summarizePost);
router.post('/assist', protect, assistWriting);

module.exports = router;
