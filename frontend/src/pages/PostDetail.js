import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { toast } from 'react-toastify';

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const { data } = await API.get(`/posts/${id}`);
      setPost(data);
      if (user) {
        setLiked(data.likes.includes(user._id));
      }
    } catch (error) {
      toast.error('Failed to fetch post');
    }
  };

  const handleLike = async () => {
    try {
      await API.post(`/posts/${id}/like`);
      setLiked(!liked);
      fetchPost();
    } catch (error) {
      toast.error('Please login to like');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/posts/${id}/comment`, { text: comment });
      setComment('');
      fetchPost();
      toast.success('Comment added!');
    } catch (error) {
      toast.error('Please login to comment');
    }
  };

  const handleSave = async () => {
    try {
      const { data } = await API.post(`/posts/${id}/save`);
      setSaved(data.saved);
      toast.success(data.saved ? 'Post saved!' : 'Post unsaved!');
    } catch (error) {
      toast.error('Please login to save');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this post?')) {
      try {
        await API.delete(`/posts/${id}`);
        toast.success('Post deleted!');
        navigate('/');
      } catch (error) {
        toast.error('Failed to delete post');
      }
    }
  };

  if (!post) return <div className="text-center py-12">Loading...</div>;

  const canEdit = user && (user._id === post.createdBy._id || user.role === 'admin');

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-start mb-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {post.category}
            </span>
            <span className="text-gray-500 text-sm">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

          <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
            <span>👤 {post.createdBy.username}</span>
            <span>❤️ {post.likes.length}</span>
            <span>💬 {post.comments.length}</span>
          </div>

          <div className="flex gap-2 mb-6">
            {post.tags.map((tag, i) => (
              <span key={i} className="bg-gray-200 px-3 py-1 rounded text-sm">
                #{tag}
              </span>
            ))}
          </div>

          <p className="text-gray-700 text-lg leading-relaxed mb-8 whitespace-pre-wrap">
            {post.description}
          </p>

          <div className="flex gap-4 mb-8">
            <button
              onClick={handleLike}
              className={`px-6 py-2 rounded-lg ${liked ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
            >
              {liked ? '❤️ Liked' : '🤍 Like'}
            </button>
            <button
              onClick={handleSave}
              className={`px-6 py-2 rounded-lg ${saved ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
            >
              {saved ? '⭐ Saved' : '☆ Save'}
            </button>
            {canEdit && (
              <>
                <button
                  onClick={() => navigate(`/edit/${id}`)}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg"
                >
                  Delete
                </button>
              </>
            )}
          </div>

          <div className="border-t pt-8">
            <h3 className="text-2xl font-bold mb-4">Comments ({post.comments.length})</h3>

            {user && (
              <form onSubmit={handleComment} className="mb-6">
                <textarea
                  className="w-full px-4 py-2 border rounded-lg mb-2"
                  rows="3"
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg"
                >
                  Post Comment
                </button>
              </form>
            )}

            <div className="space-y-4">
              {post.comments.map((c, i) => (
                <div key={i} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">{c.user.username}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;