import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { toast } from 'react-toastify';

const categoryColors = {
  Technology: 'bg-blue-100 text-blue-700',
  Science: 'bg-green-100 text-green-700',
  Business: 'bg-amber-100 text-amber-700',
  Education: 'bg-purple-100 text-purple-700',
  Health: 'bg-rose-100 text-rose-700',
  Other: 'bg-slate-100 text-slate-700',
};

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchPost(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPost = async () => {
    try {
      const { data } = await API.get(`/posts/${id}`);
      setPost(data);
      if (user) setLiked(data.likes.includes(user._id));
    } catch {
      toast.error('Failed to fetch post');
    }
  };

  const handleLike = async () => {
    try {
      setLikeAnim(true);
      setTimeout(() => setLikeAnim(false), 600);
      await API.post(`/posts/${id}/like`);
      setLiked(!liked);
      fetchPost();
    } catch {
      toast.error('Please login to like');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post(`/posts/${id}/comment`, { text: comment });
      setComment('');
      fetchPost();
      toast.success('Comment added!');
    } catch {
      toast.error('Please login to comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSave = async () => {
    try {
      const { data } = await API.post(`/posts/${id}/save`);
      setSaved(data.saved);
      toast.success(data.saved ? '🔖 Post saved!' : 'Post unsaved');
    } catch {
      toast.error('Please login to save');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await API.delete(`/posts/${id}`);
      toast.success('Post deleted');
      navigate('/');
    } catch {
      toast.error('Failed to delete post');
    }
  };

  if (!post) return (
    <div className="page-container flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500">Loading post...</p>
      </div>
    </div>
  );

  const canEdit = user && (user._id === post.createdBy._id || user.role === 'admin');

  return (
    <div className="page-container">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition mb-6 text-sm font-medium group">
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <article className="card p-7 md:p-10 mb-6 animate-slide-up">
          {/* Meta */}
          <div className="flex items-center justify-between mb-6">
            <span className={`badge ${categoryColors[post.category] || categoryColors.Other}`}>{post.category}</span>
            <span className="text-xs text-slate-400">{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-5 leading-tight">{post.title}</h1>

          {/* Author */}
          <Link to={`/user/${post.createdBy._id}`} className="flex items-center gap-3 mb-6 group w-fit">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
              {post.createdBy.username[0].toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition">{post.createdBy.username}</p>
              <p className="text-xs text-slate-400">{post.views || 0} views</p>
            </div>
          </Link>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, i) => (
                <span key={i} className="badge bg-indigo-50 text-indigo-600">#{tag}</span>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="prose prose-slate max-w-none mb-8">
            <p className="text-slate-700 text-base leading-relaxed whitespace-pre-wrap">{post.description}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-6 border-t border-slate-100">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 ${
                liked ? 'bg-red-500 text-white shadow-md shadow-red-200' : 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-500'
              } ${likeAnim ? 'scale-125' : ''}`}
            >
              {liked ? '❤️' : '🤍'} {post.likes.length} {liked ? 'Liked' : 'Like'}
            </button>
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 ${
                saved ? 'bg-amber-500 text-white shadow-md shadow-amber-200' : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-600'
              }`}
            >
              {saved ? '🔖 Saved' : '☆ Save'}
            </button>
            {canEdit && (
              <div className="flex gap-2 ml-auto">
                <button onClick={() => navigate(`/edit/${id}`)} className="btn-secondary text-sm py-2 px-4">✏️ Edit</button>
                <button onClick={handleDelete} className="btn-danger text-sm py-2 px-4">🗑 Delete</button>
              </div>
            )}
          </div>
        </article>

        {/* Comments */}
        <div className="card p-7 animate-slide-up">
          <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">
            💬 Comments <span className="badge bg-indigo-100 text-indigo-700">{post.comments.length}</span>
          </h3>

          {user ? (
            <form onSubmit={handleComment} className="mb-8">
              <div className="flex gap-3">
                <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {user.username[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <textarea
                    className="input-field resize-none mb-3"
                    rows="3"
                    placeholder="Share your thoughts..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  />
                  <button type="submit" disabled={submitting} className="btn-primary text-sm py-2 px-5 flex items-center gap-2">
                    {submitting ? <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Posting...</> : 'Post Comment'}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6 text-center">
              <p className="text-sm text-indigo-700">
                <Link to="/login" className="font-semibold hover:underline">Sign in</Link> to leave a comment
              </p>
            </div>
          )}

          <div className="space-y-4">
            {post.comments.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <div className="text-3xl mb-2">💬</div>
                <p className="text-sm">No comments yet. Be the first!</p>
              </div>
            ) : post.comments.map((c, i) => (
              <div key={i} className="flex gap-3 group">
                <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold text-sm flex-shrink-0">
                  {c.user.username[0].toUpperCase()}
                </div>
                <div className="flex-1 bg-slate-50 rounded-2xl px-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-slate-800">{c.user.username}</span>
                    <span className="text-xs text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
