const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getConversation,
  getConversations,
  markAsRead,
  getUnreadCount
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', sendMessage);
router.get('/conversations', getConversations);
router.get('/unread-count', getUnreadCount);
router.get('/:userId', getConversation);
router.put('/:userId/read', markAsRead);

module.exports = router;