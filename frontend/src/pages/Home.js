import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import API from '../utils/api';
import PostCard from '../components/PostCard';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import Landing from './Landing';
import { API_URL } from '../utils/config';

const makeSlideImage = (palette, label) => {
  const svg = `
    <svg width="520" height="360" viewBox="0 0 520 360" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="32" y1="24" x2="488" y2="336" gradientUnits="userSpaceOnUse">
          <stop stop-color="${palette[0]}"/>
          <stop offset="1" stop-color="${palette[1]}"/>
        </linearGradient>
      </defs>
      <rect width="520" height="360" rx="36" fill="url(#bg)"/>
      <circle cx="403" cy="92" r="74" fill="white" fill-opacity="0.18"/>
      <circle cx="120" cy="296" r="96" fill="white" fill-opacity="0.14"/>
      <rect x="52" y="60" width="174" height="18" rx="9" fill="white" fill-opacity="0.28"/>
      <rect x="52" y="94" width="242" height="28" rx="14" fill="white" fill-opacity="0.92"/>
      <rect x="52" y="136" width="210" height="18" rx="9" fill="white" fill-opacity="0.24"/>
      <rect x="52" y="194" width="164" height="92" rx="24" fill="white" fill-opacity="0.92"/>
      <rect x="238" y="194" width="230" height="42" rx="21" fill="white" fill-opacity="0.22"/>
      <rect x="238" y="252" width="184" height="18" rx="9" fill="white" fill-opacity="0.18"/>
      <text x="52" y="332" fill="white" fill-opacity="0.92" font-family="Arial, sans-serif" font-size="26" font-weight="700">${label}</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const heroSlides = [
  {
    tag: 'Knowledge Week',
    title: 'Trending ideas from top contributors',
    description: 'Discover the most discussed posts, save useful insights, and stay ahead with community-picked content.',
    accent: 'from-sky-500 via-indigo-500 to-violet-600',
    images: [
      makeSlideImage(['#0ea5e9', '#7c3aed'], 'Trending feed'),
      makeSlideImage(['#38bdf8', '#6366f1'], 'Top authors'),
      makeSlideImage(['#2563eb', '#8b5cf6'], 'Saved insights'),
      makeSlideImage(['#1d4ed8', '#7c3aed'], 'Fresh topics'),
      makeSlideImage(['#0f766e', '#4f46e5'], 'Smart picks'),
      makeSlideImage(['#0284c7', '#9333ea'], 'Hot discussions')
    ],
    statLabel: 'Featured posts',
    statValue: '1.2K+',
    cta: 'Explore Trending',
    link: '/trending'
  },
  {
    tag: 'Create Faster',
    title: 'Publish your next post in minutes',
    description: 'Share tutorials, explainers, and updates with a cleaner writing flow built for quick publishing.',
    accent: 'from-orange-400 via-rose-500 to-pink-600',
    images: [
      makeSlideImage(['#fb923c', '#e11d48'], 'Quick publishing'),
      makeSlideImage(['#fdba74', '#f43f5e'], 'Draft ideas'),
      makeSlideImage(['#f97316', '#db2777'], 'Clean editor'),
      makeSlideImage(['#fb7185', '#ea580c'], 'Fast writing'),
      makeSlideImage(['#f59e0b', '#e11d48'], 'Story blocks'),
      makeSlideImage(['#ea580c', '#be185d'], 'Post previews')
    ],
    statLabel: 'Posts this week',
    statValue: '8.4K',
    cta: 'Create Post',
    link: '/create'
  },
  {
    tag: 'Stay Connected',
    title: 'Message creators and build your network',
    description: 'Start conversations directly from the feed and turn useful posts into real connections.',
    accent: 'from-emerald-400 via-teal-500 to-cyan-600',
    images: [
      makeSlideImage(['#34d399', '#0891b2'], 'Community chat'),
      makeSlideImage(['#2dd4bf', '#0f766e'], 'Team updates'),
      makeSlideImage(['#10b981', '#0284c7'], 'Creator network'),
      makeSlideImage(['#22c55e', '#0ea5e9'], 'Inbox flow'),
      makeSlideImage(['#14b8a6', '#0369a1'], 'Live messages'),
      makeSlideImage(['#059669', '#06b6d4'], 'New connections')
    ],
    statLabel: 'Active chats',
    statValue: '24K+',
    cta: 'Open Messages',
    link: '/messages'
  }
];

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
  <div className="card space-y-4 p-5">
    <div className="flex items-center gap-3">
      <div className="skeleton h-9 w-9 rounded-full" />
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

const SLIDE_DURATION = 5000;

const HeroCarousel = ({ username }) => {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);

  const clearTimers = () => {
    clearTimeout(intervalRef.current);
  };

  const startSlide = (index = null) => {
    clearTimers();
    if (index !== null) setCurrent(index);

    intervalRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % heroSlides.length);
      startSlide();
    }, SLIDE_DURATION);
  };

  useEffect(() => {
    startSlide();
    return clearTimers;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const goTo = (index) => startSlide(index);

  const activeSlide = heroSlides[current];

  return (
    <div className="relative mb-6 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
      {/* Slides — fade crossfade like Flipkart */}
      <div className="relative" style={{ minHeight: '420px' }}>
        <section
          key={activeSlide.title}
          className={`bg-gradient-to-r ${activeSlide.accent} animate-fade-in p-5 sm:p-8`}
        >
          <div className="grid items-center gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="mb-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
                {activeSlide.tag}
              </p>
              <p className="mb-2 text-sm font-medium text-white/80">Welcome back, {username}</p>
              <h2 className="max-w-2xl text-2xl font-extrabold leading-tight text-white sm:text-4xl">
                {activeSlide.title}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85 sm:text-base">
                {activeSlide.description}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  to={activeSlide.link}
                  className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {activeSlide.cta}
                </Link>
                <div className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white">
                  Smart Info Platform
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/12 p-4">
              <div className="overflow-hidden rounded-2xl bg-white/95 p-3 text-slate-800 shadow-lg">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {activeSlide.images.map((image, index) => (
                    <div
                      key={`${activeSlide.title}-${index}`}
                      className="overflow-hidden rounded-xl bg-slate-100 shadow-sm"
                    >
                      <img
                        src={image}
                        alt={`${activeSlide.title} preview ${index + 1}`}
                        className="h-24 w-full object-cover sm:h-20"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {activeSlide.statLabel}
                  </p>
                  <div className="mt-2 flex items-end justify-between gap-3">
                    <p className="text-3xl font-black text-slate-900">{activeSlide.statValue}</p>
                    <div className="rounded-xl bg-slate-100 px-3 py-1.5 text-right">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Live</p>
                      <p className="text-sm font-bold text-slate-700">Updated</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="relative z-20 flex justify-center gap-2 py-3">
        {heroSlides.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            onClick={() => goTo(index)}
            className={`rounded-full transition-all duration-300 ${
              current === index ? 'h-2 w-6 bg-white' : 'h-2 w-2 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

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
      setPosts((prev) => [newPost, ...prev]);
      toast.info('New post added to the feed');
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
    } catch {
      setTrendingPosts([]);
    }
  };

  const activeCategoryLabel = useMemo(() => {
    if (!category) return 'All';
    return category;
  }, [category]);

  if (!user) return <Landing />;

  return (
    <div className="page-container">
      <div className="container mx-auto px-4">
        <div className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 shadow-xl">
          <div className="flex items-center justify-between gap-4 p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-black text-white shadow-lg ring-2 ring-white/30">
                  {user.avatar
                    ? <img src={user.avatar} alt={user.username} className="h-14 w-14 rounded-2xl object-cover" />
                    : user.username[0].toUpperCase()}
                </div>
                <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-400 ring-2 ring-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white/70">
                  {new Date().getHours() < 12 ? '☀️ Good morning' : new Date().getHours() < 17 ? '👋 Good afternoon' : '🌙 Good evening'}
                </p>
                <h1 className="text-xl font-extrabold text-white sm:text-2xl">{user.username}</h1>
                <p className="mt-0.5 text-xs text-white/60">Welcome back to your feed</p>
              </div>
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <div className="rounded-2xl bg-white/10 px-4 py-3 text-center backdrop-blur-sm">
                <p className="text-lg font-black text-white">{posts.length}</p>
                <p className="text-[11px] font-medium text-white/60">Posts</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-4 py-3 text-center backdrop-blur-sm">
                <p className="text-lg font-black text-white">{trendingPosts.length}</p>
                <p className="text-[11px] font-medium text-white/60">Trending</p>
              </div>
              <Link
                to="/create"
                className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-700 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                + Create Post
              </Link>
            </div>
          </div>
          <div className="flex gap-4 border-t border-white/10 px-6 py-3">
            <span className="text-xs text-white/50">🔥 {trendingPosts[0]?.title || 'No trending posts yet'}</span>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="min-w-0 flex-1">
            <HeroCarousel username={user.username} />

            <div className="card mb-5 p-4">
              <div className="flex flex-col gap-3 md:flex-row">
                <div className="relative flex-1">
                  <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search posts..."
                    className="input-field py-2.5 pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <select
                  className="input-field w-full py-2.5 md:w-44"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="latest">Latest</option>
                  <option value="trending">Popular</option>
                </select>
              </div>
            </div>

            <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map(({ label, icon }) => (
                <button
                  key={label}
                  onClick={() => setCategory(label === 'All' ? '' : label)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition-all active:scale-95 ${
                    activeCategoryLabel === label
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  <span className="text-base">{icon}</span>
                  {label}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {[...Array(4)].map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            ) : posts.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            ) : (
              <div className="card p-14 text-center">
                <div className="mb-4 text-5xl">🔍</div>
                <h3 className="mb-2 text-lg font-semibold text-slate-700">No posts found</h3>
                <p className="mb-5 text-slate-400">
                  {search || category ? `No results for "${search}" ${category ? `in ${category}` : ''}` : 'Be the first to post.'}
                </p>
                {(search || category) && (
                  <button onClick={() => { setSearch(''); setCategory(''); }} className="btn-primary">
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="hidden w-72 flex-shrink-0 lg:block">
            <div className="sticky top-24 space-y-5">
              <div className="card p-5">
                <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-800">
                  <span className="text-lg">⚡</span>
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Link to="/create" className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-indigo-50 hover:text-indigo-700">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-lg">✏️</span>
                    <span className="text-sm font-medium text-slate-700">Create Post</span>
                  </Link>
                  <Link to="/saved" className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-amber-50 hover:text-amber-700">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-lg">🔖</span>
                    <span className="text-sm font-medium text-slate-700">Saved Posts</span>
                  </Link>
                  <Link to="/messages" className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-emerald-50 hover:text-emerald-700">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-lg">💬</span>
                    <span className="text-sm font-medium text-slate-700">Messages</span>
                  </Link>
                </div>
              </div>

              <div className="card p-5">
                <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-800">
                  <span className="text-lg">🔥</span>
                  Trending Now
                </h3>
                <div className="space-y-3">
                  {trendingPosts.length > 0 ? (
                    trendingPosts.map((post, index) => (
                      <Link key={post._id} to={`/post/${post._id}`} className="flex gap-3 group">
                        <span className="w-6 flex-shrink-0 text-lg font-black text-slate-700">#{index + 1}</span>
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-sm font-semibold leading-snug text-slate-700 transition group-hover:text-indigo-600">
                            {post.title}
                          </p>
                          <div className="mt-1 flex gap-2 text-xs text-slate-400">
                            <span>👁 {post.views}</span>
                            <span>❤️ {post.likes?.length || 0}</span>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="py-2 text-center text-sm text-slate-400">No trending posts yet</p>
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
