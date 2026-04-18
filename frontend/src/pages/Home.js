import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import API from '../utils/api';
import PostCard from '../components/PostCard';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import Landing from './Landing';
import { API_URL } from '../utils/config';

const heroSlides = [
  {
    tag: 'Knowledge Week',
    title: 'Trending ideas from top contributors',
    description: 'Discover the most discussed posts, save useful insights, and stay ahead with community-picked content.',
    accent: 'from-sky-500 via-indigo-500 to-violet-600',
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
    statLabel: 'Active chats',
    statValue: '24K+',
    cta: 'Open Messages',
    link: '/messages'
  }
];

const categories = [
  { label: 'All', icon: 'All' },
  { label: 'Technology', icon: 'Tech' },
  { label: 'Science', icon: 'Sci' },
  { label: 'Business', icon: 'Biz' },
  { label: 'Education', icon: 'Edu' },
  { label: 'Health', icon: 'Health' },
  { label: 'Other', icon: 'More' }
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

const SLIDE_DURATION = 4000;

const HeroCarousel = ({ username }) => {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);
  const progressRef = useRef(null);
  const startTimeRef = useRef(null);

  const clearTimers = () => {
    clearInterval(intervalRef.current);
    cancelAnimationFrame(progressRef.current);
  };

  const startSlide = (index = null) => {
    clearTimers();
    if (index !== null) setCurrent(index);
    setProgress(0);
    startTimeRef.current = performance.now();

    const tick = (now) => {
      const elapsed = now - startTimeRef.current;
      const pct = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        progressRef.current = requestAnimationFrame(tick);
      }
    };
    progressRef.current = requestAnimationFrame(tick);

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
  const goPrev = () => startSlide((current - 1 + heroSlides.length) % heroSlides.length);
  const goNext = () => startSlide((current + 1) % heroSlides.length);

  const handleMouseEnter = () => {
    setPaused(true);
    clearTimers();
  };

  const handleMouseLeave = () => {
    setPaused(false);
    startSlide(current);
  };

  return (
    <div
      className="relative mb-6 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slides — fade crossfade like Flipkart */}
      <div className="relative" style={{ minHeight: '260px' }}>
        {heroSlides.map((slide, index) => (
          <section
            key={slide.title}
            className={`absolute inset-0 bg-gradient-to-r ${slide.accent} p-5 sm:p-8 transition-opacity duration-500 ${
              index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div className="grid items-center gap-6 lg:grid-cols-[1.4fr_0.7fr]">
              <div>
                <p className="mb-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
                  {slide.tag}
                </p>
                <p className="mb-2 text-sm font-medium text-white/80">Welcome back, {username}</p>
                <h2 className="max-w-2xl text-2xl font-extrabold leading-tight text-white sm:text-4xl">
                  {slide.title}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85 sm:text-base">
                  {slide.description}
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to={slide.link}
                    className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    {slide.cta}
                  </Link>
                  <div className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm">
                    Smart Info Platform
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/20 bg-white/12 p-5 backdrop-blur-md">
                <div className="rounded-2xl bg-white/95 p-5 text-slate-800">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {slide.statLabel}
                  </p>
                  <p className="mt-2 text-4xl font-black text-slate-900">{slide.statValue}</p>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-400">Fast discovery</p>
                      <p className="mt-1 text-sm font-bold text-slate-700">Clean feed filters</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-400">Better engagement</p>
                      <p className="mt-1 text-sm font-bold text-slate-700">Real-time updates</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Left arrow */}
      <button
        type="button"
        onClick={goPrev}
        className="absolute left-3 top-1/2 z-20 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow-md backdrop-blur transition hover:bg-white hover:scale-110"
        aria-label="Previous slide"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Right arrow */}
      <button
        type="button"
        onClick={goNext}
        className="absolute right-3 top-1/2 z-20 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow-md backdrop-blur transition hover:bg-white hover:scale-110"
        aria-label="Next slide"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Bottom bar: dots + progress */}
      <div className="relative z-20 flex flex-col items-center gap-2 bg-white/10 pb-3 pt-2 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              onClick={() => goTo(index)}
              className={`rounded-full transition-all duration-300 ${
                current === index ? 'h-2.5 w-7 bg-white' : 'h-2 w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        {/* Progress bar */}
        <div className="h-0.5 w-24 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white transition-none"
            style={{ width: `${paused ? progress : progress}%` }}
          />
        </div>
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
        <div className="mb-6 flex items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white shadow-lg">
          <div>
            <p className="text-sm text-slate-300">Main page</p>
            <h1 className="text-2xl font-bold sm:text-3xl">Home feed for {user.username}</h1>
            <p className="mt-1 text-sm text-slate-300">Now with a Flipkart-style sliding banner at the top.</p>
          </div>
          <Link
            to="/create"
            className="hidden rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:-translate-y-0.5 hover:shadow-lg md:inline-flex"
          >
            Create Post
          </Link>
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
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em]">{icon}</span>
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
                <div className="mb-4 text-5xl">?</div>
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
                  <span className="rounded-lg bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-600">Quick</span>
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Link to="/create" className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-indigo-50 hover:text-indigo-700">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-700">NEW</span>
                    <span className="text-sm font-medium text-slate-700">Create Post</span>
                  </Link>
                  <Link to="/saved" className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-amber-50 hover:text-amber-700">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-xs font-bold text-amber-700">SAVE</span>
                    <span className="text-sm font-medium text-slate-700">Saved Posts</span>
                  </Link>
                  <Link to="/messages" className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-emerald-50 hover:text-emerald-700">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-xs font-bold text-emerald-700">CHAT</span>
                    <span className="text-sm font-medium text-slate-700">Messages</span>
                  </Link>
                </div>
              </div>

              <div className="card p-5">
                <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-800">
                  <span className="rounded-lg bg-rose-50 px-2 py-1 text-xs font-bold text-rose-600">Hot</span>
                  Trending Now
                </h3>
                <div className="space-y-3">
                  {trendingPosts.length > 0 ? (
                    trendingPosts.map((post, index) => (
                      <Link key={post._id} to={`/post/${post._id}`} className="flex gap-3 group">
                        <span className="w-6 flex-shrink-0 text-lg font-black text-slate-200">#{index + 1}</span>
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-sm font-semibold leading-snug text-slate-700 transition group-hover:text-indigo-600">
                            {post.title}
                          </p>
                          <div className="mt-1 flex gap-2 text-xs text-slate-400">
                            <span>{post.views} views</span>
                            <span>{post.likes?.length || 0} likes</span>
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
