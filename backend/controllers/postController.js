const Post = require('../models/Post');
const Notification = require('../models/Notification');

exports.createPost = async (req, res) => {
  try {
    const { title, description, category, tags } = req.body;
    
    const post = await Post.create({
      title,
      description,
      category,
      tags: tags || [],
      createdBy: req.user._id
    });

    const populatedPost = await Post.findById(post._id).populate('createdBy', 'username email');

    // Emit socket event for new post
    if (req.io) {
      req.io.emit('newPost', populatedPost);
    }

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    let query = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    let posts = Post.find(query).populate('createdBy', 'username email');

    if (sort === 'trending') {
      posts = posts.sort({ 'likes': -1 });
    } else {
      posts = posts.sort({ createdAt: -1 });
    }

    const result = await posts;
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('createdBy', 'username email')
      .populate('comments.user', 'username');

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.views += 1;
    
    if (req.user && !post.viewedBy.some(v => v.user.toString() === req.user._id.toString())) {
      post.viewedBy.push({ user: req.user._id });
    }
    
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { title, description, category, tags } = req.body;
    
    post.title = title || post.title;
    post.description = description || post.description;
    post.category = category || post.category;
    post.tags = tags || post.tags;

    await post.save();

    const updatedPost = await Post.findById(post._id).populate('createdBy', 'username email');
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const index = post.likes.indexOf(req.user._id);

    if (index > -1) {
      post.likes.splice(index, 1);
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    res.json({ likes: post.likes.length, liked: index === -1 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.commentPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.comments.push({
      user: req.user._id,
      text: req.body.text
    });

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('createdBy', 'username email')
      .populate('comments.user', 'username');

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.savePost = async (req, res) => {
  try {
    const user = req.user;
    const postId = req.params.id;

    const index = user.savedPosts.indexOf(postId);

    if (index > -1) {
      user.savedPosts.splice(index, 1);
    } else {
      user.savedPosts.push(postId);
    }

    await user.save();
    res.json({ saved: index === -1 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSavedPosts = async (req, res) => {
  try {
    const user = await req.user.populate({
      path: 'savedPosts',
      populate: { path: 'createdBy', select: 'username email' }
    });

    res.json(user.savedPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.broadcastMessage = async (req, res) => {
  try {
    const { title, message } = req.body;
    const User = require('../models/User');
    const users = await User.find({});
    
    const Notification = require('../models/Notification');
    const notifications = users.map(user => ({
      user: user._id,
      message: `${title}: ${message}`,
      type: 'announcement'
    }));
    
    await Notification.insertMany(notifications);
    
    if (req.io) {
      req.io.emit('announcement', { title, message });
    }
    
    res.json({ message: 'Broadcast sent to all users', count: users.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTrendingPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('createdBy', 'username email avatar');
    
    const scoredPosts = posts.map(post => ({
      ...post.toObject(),
      trendingScore: (post.views * 1) + (post.likes.length * 5) + (post.comments.length * 3)
    }));
    
    scoredPosts.sort((a, b) => b.trendingScore - a.trendingScore);
    
    res.json(scoredPosts.slice(0, 10));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};