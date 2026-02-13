const express = require('express');
const router = express.Router();
const {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  likePost,
  commentPost,
  savePost,
  getSavedPosts,
  getTrendingPosts,
  broadcastMessage
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(getPosts)
  .post(protect, createPost);

router.get('/saved', protect, getSavedPosts);
router.get('/trending', getTrendingPosts);
router.post('/broadcast', protect, broadcastMessage);

router.route('/:id')
  .get(getPost)
  .put(protect, updatePost)
  .delete(protect, deletePost);

router.post('/:id/like', protect, likePost);
router.post('/:id/comment', protect, commentPost);
router.post('/:id/save', protect, savePost);

module.exports = router;