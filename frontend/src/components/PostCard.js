import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const categoryConfig = {
  Technology: { bg: 'bg-blue-500', light: 'bg-blue-50 text-blue-700', dot: 'bg-blue-500' },
  Science:    { bg: 'bg-emerald-500', light: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  Business:   { bg: 'bg-amber-500', light: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
  Education:  { bg: 'bg-violet-500', light: 'bg-violet-50 text-violet-700', dot: 'bg-violet-500' },
  Health:     { bg: 'bg-rose-500', light: 'bg-rose-50 text-rose-700', dot: 'bg-rose-500' },
  Other:      { bg: 'bg-slate-500', light: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' },
};

const readTime = (text) => {
  const words = text?.split(/\s+/).filter(Boolean).length || 0;
  return Math.max(1, Math.ceil(words / 200));
};

const PostCard = ({ post }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [following, setFollowing] = useState(false);
  const [liked, setLiked] = useState(post.likes?.includes(user?._id));
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [likeAnim, setLikeAnim] = useState(false);
  const [hovered, setHovered] = useState(false);

  const cat = categoryConfig[post.category] || categoryConfig.Other;

  const handleLike = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setLiked((p) => !p);
    setLikeCount((p) => liked ? p - 1 : p + 1);
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 600);
    try {
      const API = (await import('../utils/api')).default;
      await API.post(`/posts/${post._id}/like`);
    } catch {}
  };

  const handleFollow = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    try {
      const API = (await import('../utils/api')).default;
      const { data } = await API.post(`/users/follow/${post.createdBy._id}`);
      setFollowing(data.following);
    } catch {}
  };

  const handleMessage = (e) => {
    e.preventDefault();
    navigate(user ? `/messages/${post.createdBy._id}` : '/login');
  };

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-200/60 hover:ring-slate-300 dark:bg-slate-800 dark:ring-slate-700"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top accent bar */}
      <div className={`h-1 w-full ${cat.bg} transition-all duration-300 ${hovered ? 'h-1.5' : ''}`} />

      {/* Cover Image */}
      {post.image && (
        <Link to={`/post/${post._id}`} className="relative overflow-hidden block">
          <img
            src={post.image}
            alt={post.title}
            className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
      )}

      <div className="flex flex-1 flex-col p-5">
        {/* Author + Category */}
        <div className="mb-3 flex items-center justify-between">
          <Link to={`/user/${post.createdBy?._id}`} className="flex items-center gap-2.5 group/author">
            <div className="relative">
              {post.createdBy?.avatar ? (
                <img src={post.createdBy.avatar} alt={post.createdBy.username} className="h-9 w-9 rounded-full object-cover ring-2 ring-white shadow-sm" />
              ) : (
                <div className={`h-9 w-9 ${cat.bg} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                  {post.createdBy?.username[0].toUpperCase()}
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 group-hover/author:text-indigo-600 transition dark:text-slate-100">
                {post.createdBy?.username}
              </p>
              <p className="text-xs text-slate-400">
                {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </Link>
          <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cat.light}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${cat.dot}`} />
            {post.category}
          </span>
        </div>

        {/* Title + Description */}
        <Link to={`/post/${post._id}`} className="group/title flex-1">
          <h3 className="mb-1.5 line-clamp-2 font-bold leading-snug text-slate-800 transition group-hover/title:text-indigo-600 dark:text-slate-100">
            {post.title}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {post.description}
          </p>
        </Link>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats row */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-700">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            {/* Views */}
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {post.views || 0}
            </span>
            {/* Comments */}
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {post.comments?.length || 0}
            </span>
            {/* Read time */}
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {readTime(post.description)} min read
            </span>
          </div>

          {/* Like button */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all active:scale-90 ${
              liked
                ? 'bg-rose-50 text-rose-500 dark:bg-rose-900/30'
                : 'bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-400 dark:bg-slate-700 dark:hover:bg-rose-900/30'
            }`}
          >
            <svg
              className={`h-4 w-4 transition-transform duration-300 ${likeAnim ? 'scale-150' : 'scale-100'}`}
              fill={liked ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {likeCount}
          </button>
        </div>

        {/* Action buttons — slide up on hover */}
        {user && post.createdBy?._id !== user._id && (
          <div className={`mt-3 flex gap-2 transition-all duration-300 ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <button
              onClick={handleFollow}
              className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-all active:scale-95 ${
                following
                  ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300'
                  : `${cat.bg} text-white hover:opacity-90`
              }`}
            >
              {following ? '✓ Following' : '+ Follow'}
            </button>
            <button
              onClick={handleMessage}
              className="flex-1 rounded-xl border border-slate-200 py-2 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50 active:scale-95 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              💬 Message
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
