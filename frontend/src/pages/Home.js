import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import API from '../utils/api';
import PostCard from '../components/PostCard';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import Landing from './Landing';
import { API_URL } from '../utils/config';

const infoBannerItems = [
  { icon: '🚀', text: 'Share your knowledge and grow with the community', color: 'from-indigo-500 to-purple-600' },
  { icon: '🔥', text: 'Trending posts updated every hour — stay ahead!', color: 'from-orange-500 to-red-500' },
  { icon: '💬', text: 'Real-time messaging — connect with anyone instantly', color: 'from-green-500 to-teal-500' },
  { icon: '🤖', text: 'AI Writing Assistant available on every post — try it!', color: 'from-violet-500 to-indigo-500' },
  { icon: '📚', text: 'Explore 6 categories: Tech, Science, Business & more', color: 'from-blue-500 to-cyan-500' },
  { icon: '🏆', text: 'Top contributors get featured on the Trending page', color: 'from-amber-500 to-orange-500' },
];

const InfoBanner = () => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef(null);

  const goTo = (index) => {
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 300);
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % infoBannerItems.length);
        setAnimating(false);
      }, 300);
    }, 2000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const item = infoBannerItems[current];

  return (
    <div className={`bg-gradient-to-r ${item.color} rounded-2xl px-5 py-3 mb-6 transition-all duration-300`}>
      <div className="flex items-center justify-between gap-4">
        <div className={`flex items-center gap-3 transition-all duration-300 ${animating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
          <span className="text-2xl">{item.icon}</span>
          <p className="text-white text-sm font-medium">{item.text}</p>
        </div>
        {/* Dots */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {infoBannerItems.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'w-4 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const categories = [
  { label: 'All', icon: '🌐' },
  { label: 'Technology', icon: '💻' },
  { label: 'Science', icon: '🔬' },
  { label: 'Business', icon: '📈' },
  { label: 'Education', icon: '📚' },
  { label: 'Health', icon: '❤️' },
  { label: 'Other', icon: '✨' },
];

const SkeletonCard = () => (
  <div className="card p-5 space-y-4">
    <div className="flex items-center gap-3">
      <div className="skeleton w-9 h-9 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-3 w-24" />
        <div className="skeleton h-3 w-16" />
      </div>
      <div className="skeleton h-5 w-20 rounded-full" />
    </div>
    <div className="space-y-2">
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-4/5" />
      <div className="skeleton h-3 w-3/5" />
    </div>
    <div className="flex gap-2">
      <div className="skeleton h-5 w-12 rounded-md" />
      <div className="skeleton h-5 w-12 rounded-md" />
    </div>
  </div>
);

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('latest');
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
    fetchTrending();
    const socket = io(API_URL);
    socket.on('newPost', (newPost) => {
      setPosts(prev => [newPost, ...prev]);
      toast.info('✨ New post just added!');
    });
    return () => socket.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchPosts();
    fetchTrending();
  }, [search, category, sort]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (sort) params.sort = sort;
      const { data } = await API.get('/posts', { params });
      setPosts(data);
    } catch {
      toast.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchTrending = async () => {
    try {
      const { data } = await API.get('/posts/trending');
      setTrendingPosts(data.slice(0, 5));
    } catch { /* silent */ }
  };

  if (!user) return <Landing />;

  return (
    <div className="page-container">
      <div className="container mx-auto px-4">
        {/* Welcome Banner */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-7 mb-8 overflow-hidden shadow-xl shadow-indigo-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-white/10 rounded-full translate-y-1/2" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-indigo-200 text-sm font-medium mb-1">Welcome back 👋</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">{user.username}</h2>
              <p className="text-indigo-100 text-sm">Discover and share amazing content</p>
            </div>
            <Link to="/create" className="hidden md:flex items-center gap-2 bg-white text-indigo-700 px-5 py-2.5 rounded-xl font-bold hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm">
              ✏️ Create Post
            </Link>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Info Banner */}
            <InfoBanner />

            {/* Search & Sort */}
            <div className="card p-4 mb-5">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search posts..."
                    className="input-field pl-10 py-2.5"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <select
                  className="input-field w-40 py-2.5"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="latest">🕐 Latest</option>
                  <option value="trending">🔥 Popular</option>
                </select>
              </div>
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
              {categories.map(({ label, icon }) => (
                <button
                  key={label}
                  onClick={() => setCategory(label === 'All' ? '' : label)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all active:scale-95 ${
                    (label === 'All' && category === '') || category === label
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  <span>{icon}</span> {label}
                </button>
              ))}
            </div>

            {/* Posts */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {posts.map(post => <PostCard key={post._id} post={post} />)}
              </div>
            ) : (
              <div className="card p-14 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No posts found</h3>
                <p className="text-slate-400 mb-5">
                  {search || category ? `No results for "${search}" ${category ? `in ${category}` : ''}` : 'Be the first to post!'}
                </p>
                {(search || category) && (
                  <button onClick={() => { setSearch(''); setCategory(''); }} className="btn-primary">
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-5">
              {/* Quick Actions */}
              <div className="card p-5">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span>⚡</span> Quick Actions
                </h3>
                <div className="space-y-2">
                  <Link to="/create" className="flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition group">
                    <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-sm group-hover:bg-indigo-200 transition">✏️</span>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-700">Create Post</span>
                  </Link>
                  <Link to="/saved" className="flex items-center gap-3 p-3 rounded-xl hover:bg-yellow-50 hover:text-yellow-700 transition group">
                    <span className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center text-sm group-hover:bg-yellow-200 transition">🔖</span>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-yellow-700">Saved Posts</span>
                  </Link>
                  <Link to="/messages" className="flex items-center gap-3 p-3 rounded-xl hover:bg-green-50 hover:text-green-700 transition group">
                    <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-sm group-hover:bg-green-200 transition">💬</span>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-green-700">Messages</span>
                  </Link>
                </div>
              </div>

              {/* Trending */}
              <div className="card p-5">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span>🔥</span> Trending Now
                </h3>
                <div className="space-y-3">
                  {trendingPosts.length > 0 ? trendingPosts.map((post, i) => (
                    <Link key={post._id} to={`/post/${post._id}`} className="flex gap-3 group">
                      <span className="text-lg font-black text-slate-200 w-6 flex-shrink-0">#{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition line-clamp-2 leading-snug">
                          {post.title}
                        </p>
                        <div className="flex gap-2 text-xs text-slate-400 mt-1">
                          <span>👁 {post.views}</span>
                          <span>❤️ {post.likes?.length || 0}</span>
                        </div>
                      </div>
                    </Link>
                  )) : (
                    <p className="text-sm text-slate-400 text-center py-2">No trending posts yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
