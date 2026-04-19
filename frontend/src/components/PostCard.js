import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const categoryConfig = {
  Technology:  { gradient: 'from-blue-600 to-indigo-700',   light: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',   dot: 'bg-blue-500' },
  Science:     { gradient: 'from-emerald-600 to-teal-700',  light: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', dot: 'bg-emerald-500' },
  Business:    { gradient: 'from-amber-500 to-orange-600',  light: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',  dot: 'bg-amber-500' },
  Education:   { gradient: 'from-violet-600 to-purple-700', light: 'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300', dot: 'bg-violet-500' },
  Health:      { gradient: 'from-rose-500 to-pink-600',     light: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',     dot: 'bg-rose-500' },
  Other:       { gradient: 'from-slate-600 to-slate-700',   light: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',   dot: 'bg-slate-400' },
};

const readTime = (text) => Math.max(1, Math.ceil((text?.split(/\s+/).filter(Boolean).length || 0) / 200));

const PostCard = ({ post, rank }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(post.likes?.includes(user?._id));
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [likeAnim, setLikeAnim] = useState(false);
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);
  const [hovered, setHovered] = useState(false);

  const cat = categoryConfig[post.category] || categoryConfig.Other;

  const handleLike = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setLiked(p => !p);
    setLikeCount(p => liked ? p - 1 : p + 1);
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 600);
    try {
      const API = (await import('../utils/api')).default;
      await API.post(`/posts/${post._id}/like`);
    } catch {}
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setSaved(p => !p);
    try {
      const API = (await import('../utils/api')).default;
      await API.post(`/posts/${post._id}/save`);
    } catch {}
  };

  const handleFollow = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setFollowing(p => !p);
    try {
      const API = (await import('../utils/api')).default;
      await API.post(`/users/follow/${post.createdBy._id}`);
    } catch {}
  };

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-200/80 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-300/50 hover:ring-slate-300 dark:bg-slate-800 dark:ring-slate-700 dark:hover:shadow-slate-900/50"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Rank badge for trending */}
      {rank && (
        <div className="absolute left-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-xl bg-white/90 text-sm font-black text-slate-800 shadow-md backdrop-blur-sm dark:bg-slate-800/90 dark:text-white">
          #{rank}
        </div>
      )}

      {/* Cover / Gradient Banner */}
      <Link to={`/post/${post._id}`} className="relative block overflow-hidden">
        {post.image ? (
          <div className="relative h-48 overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            {/* Category on image */}
            <div className="absolute bottom-3 left-3">
              <span className={`flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold backdrop-blur-sm ${cat.light}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${cat.dot}`} />
                {post.category}
              </span>
            </div>
            {/* Read time on image */}
            <div className="absolute bottom-3 right-3">
              <span className="rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {readTime(post.description)} min read
              </span>
            </div>
          </div>
        ) : (
          <div className={`relative h-36 bg-gradient-to-br ${cat.gradient} overflow-hidden`}>
            {/* Decorative circles */}
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
            <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-white/10" />
            <div className="absolute right-8 bottom-4 h-12 w-12 rounded-full bg-white/10" />
            <div className="absolute bottom-3 left-3">
              <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                {post.category}
              </span>
            </div>
            <div className="absolute bottom-3 right-3">
              <span className="rounded-full bg-black/20 px-2.5 py-1 text-xs font-medium text-white">
                {readTime(post.description)} min read
              </span>
            </div>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Author row */}
        <div className="mb-3 flex items-center justify-between">
          <Link to={`/user/${post.createdBy?._id}`} className="flex items-center gap-2 group/author">
            <div className="relative">
              {post.createdBy?.avatar ? (
                <img src={post.createdBy.avatar} alt={post.createdBy.username} className="h-8 w-8 rounded-full object-cover ring-2 ring-white shadow-sm dark:ring-slate-700" />
              ) : (
                <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-white text-xs font-black shadow-sm`}>
                  {post.createdBy?.username?.[0]?.toUpperCase()}
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-1 ring-white dark:ring-slate-800" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700 group-hover/author:text-indigo-600 transition dark:text-slate-200">{post.createdBy?.username}</p>
              <p className="text-[10px] text-slate-400">{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </Link>

          {/* Save button */}
          <button
            onClick={handleSave}
            className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all active:scale-90 ${
              saved ? 'bg-amber-100 text-amber-500 dark:bg-amber-900/30' : 'bg-slate-100 text-slate-400 hover:bg-amber-50 hover:text-amber-400 dark:bg-slate-700 dark:hover:bg-amber-900/30'
            }`}
          >
            <svg className="h-3.5 w-3.5" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>

        {/* Title & Description */}
        <Link to={`/post/${post._id}`} className="group/title flex-1 mb-3">
          <h3 className="mb-1.5 line-clamp-2 text-base font-extrabold leading-snug text-slate-800 transition-colors group-hover/title:text-indigo-600 dark:text-slate-100">
            {post.title}
          </h3>
          <p className="line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            {post.description}
          </p>
        </Link>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats + Like */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-700">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {post.views || 0}
            </span>
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {post.comments?.length || 0}
            </span>
          </div>

          {/* Like button */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all active:scale-90 ${
              liked
                ? 'bg-rose-100 text-rose-500 dark:bg-rose-900/30'
                : 'bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-400 dark:bg-slate-700 dark:hover:bg-rose-900/30'
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

        {/* Follow + Message — slide up on hover */}
        {user && post.createdBy?._id !== user._id && (
          <div className={`mt-3 flex gap-2 transition-all duration-300 ${hovered ? 'opacity-100 translate-y-0 max-h-12' : 'opacity-0 translate-y-3 max-h-0 overflow-hidden'}`}>
            <button
              onClick={handleFollow}
              className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all active:scale-95 ${
                following
                  ? 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                  : `bg-gradient-to-r ${cat.gradient} text-white shadow-sm hover:opacity-90`
              }`}
            >
              {following ? '✓ Following' : '+ Follow'}
            </button>
            <button
              onClick={(e) => { e.preventDefault(); navigate(user ? `/messages/${post.createdBy._id}` : '/login'); }}
              className="flex-1 rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50 active:scale-95 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
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
