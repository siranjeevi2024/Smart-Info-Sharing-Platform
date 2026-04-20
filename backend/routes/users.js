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
router.put('/update-profile', protect, async (req, res) => {
  try {
    const { username, bio } = req.body;
    if (username) {
      const taken = await require('../models/User').findOne({ username, _id: { $ne: req.user._id } });
      if (taken) return res.status(400).json({ error: 'Username already taken' });
    }
    const user = await require('../models/User').findByIdAndUpdate(
      req.user._id,
      { ...(username && { username }), ...(bio !== undefined && { bio }) },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;