const express = require('express');
const router = express.Router();
const { updateUserStatus, getUserStatus, getAllUsers, followUser, getUserProfile, getUserStats, updateAvatar } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/all', protect, getAllUsers);
router.put('/status', protect, updateUserStatus);
router.get('/status/:userId', protect, getUserStatus);
router.post('/follow/:userId', protect, followUser);
router.get('/profile/:userId', protect, getUserProfile);
router.get('/stats', protect, getUserStats);
router.put('/avatar', protect, updateAvatar);

module.exports = router;