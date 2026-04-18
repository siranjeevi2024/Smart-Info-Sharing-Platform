import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const categoryColors = {
  Technology: 'bg-blue-100 text-blue-700',
  Science: 'bg-green-100 text-green-700',
  Business: 'bg-amber-100 text-amber-700',
  Education: 'bg-purple-100 text-purple-700',
  Health: 'bg-rose-100 text-rose-700',
  Other: 'bg-slate-100 text-slate-700',
};

const PostCard = ({ post }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [following, setFollowing] = React.useState(false);

  const handleMessage = (e) => {
    e.preventDefault();
    navigate(user ? `/messages/${post.createdBy._id}` : '/login');
  };

  const handleFollow = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    try {
      const API = (await import('../utils/api')).default;
      const { data } = await API.post(`/users/follow/${post.createdBy._id}`);
      setFollowing(data.following);
    } catch {
      console.error('Failed to follow/unfollow');
    }
  };

  return (
    <div className="card flex flex-col animate-fade-in">
      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Link to={`/user/${post.createdBy?._id}`} className="flex items-center gap-2.5 group">
            {post.createdBy?.avatar ? (
              <img src={post.createdBy.avatar} alt={post.createdBy.username} className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100" />
            ) : (
              <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {post.createdBy?.username[0].toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition">{post.createdBy?.username}</p>
              <p className="text-xs text-slate-400">{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </Link>
          <span className={`badge ${categoryColors[post.category] || categoryColors.Other}`}>
            {post.category}
          </span>
        </div>

        {/* Content */}
        <Link to={`/post/${post._id}`} className="flex-1 group">
          <h3 className="font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition line-clamp-2 leading-snug">
            {post.title}
          </h3>
          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {post.description}
          </p>
        </Link>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">#{tag}</span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {post.views || 0}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {post.likes?.length || 0}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {post.comments?.length || 0}
          </span>
        </div>

        {/* Actions */}
        {user && post.createdBy?._id !== user._id && (
          <div className="flex gap-2 mt-4">
            <button onClick={handleFollow} className={`flex-1 text-sm font-semibold py-2 rounded-xl transition-all active:scale-95 ${
              following ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}>
              {following ? '✓ Following' : '+ Follow'}
            </button>
            <button onClick={handleMessage} className="flex-1 text-sm font-semibold py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all active:scale-95">
              Message
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
