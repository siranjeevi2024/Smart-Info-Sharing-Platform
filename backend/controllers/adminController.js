const User = require('../models/User');
const Post = require('../models/Post');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'}`, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await Post.deleteMany({ createdBy: user._id });
    await user.deleteOne();

    res.json({ message: 'User and their posts deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const blockedUsers = await User.countDocuments({ isBlocked: true });

    const recentPosts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('createdBy', 'username email');

    res.json({
      totalUsers,
      totalPosts,
      blockedUsers,
      recentPosts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};