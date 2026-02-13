const User = require('../models/User');

exports.updateUserStatus = async (req, res) => {
  try {
    const { isOnline } = req.body;
    
    await User.findByIdAndUpdate(req.user._id, {
      isOnline,
      lastSeen: Date.now()
    });

    res.json({ message: 'Status updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('isOnline lastSeen username');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select('username email avatar isOnline lastSeen')
      .sort({ username: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isFollowing = currentUser.following.includes(req.params.userId);

    if (isFollowing) {
      currentUser.following.pull(req.params.userId);
      userToFollow.followers.pull(req.user._id);
    } else {
      currentUser.following.push(req.params.userId);
      userToFollow.followers.push(req.user._id);
    }

    await currentUser.save();
    await userToFollow.save();

    res.json({ following: !isFollowing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password -resetPasswordToken -resetPasswordExpire')
      .populate('followers', 'username avatar')
      .populate('following', 'username avatar');
    
    const Post = require('../models/Post');
    const posts = await Post.find({ createdBy: req.params.userId })
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    res.json({ user, posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const Post = require('../models/Post');
    const posts = await Post.find({ createdBy: req.user._id })
      .populate('likes', 'username email avatar')
      .populate('viewedBy.user', 'username email avatar');
    
    const totalLikes = posts.reduce((sum, post) => sum + post.likes.length, 0);
    const totalComments = posts.reduce((sum, post) => sum + post.comments.length, 0);
    const totalViews = posts.reduce((sum, post) => sum + post.views, 0);

    const allLikers = [];
    const likerMap = new Map();
    posts.forEach(post => {
      post.likes.forEach(user => {
        if (!likerMap.has(user._id.toString())) {
          likerMap.set(user._id.toString(), user);
          allLikers.push(user);
        }
      });
    });

    const allViewers = [];
    const viewerMap = new Map();
    posts.forEach(post => {
      post.viewedBy.forEach(view => {
        if (view.user && !viewerMap.has(view.user._id.toString())) {
          viewerMap.set(view.user._id.toString(), view.user);
          allViewers.push(view.user);
        }
      });
    });

    console.log('Total viewers found:', allViewers.length);
    console.log('Viewers:', allViewers);

    res.json({
      totalPosts: posts.length,
      totalLikes,
      totalComments,
      totalViews,
      followers: req.user.followers.length,
      following: req.user.following.length,
      likers: allLikers,
      viewers: allViewers,
      posts: posts.map(p => ({
        _id: p._id,
        title: p.title,
        likes: p.likes,
        comments: p.comments,
        views: p.views
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};