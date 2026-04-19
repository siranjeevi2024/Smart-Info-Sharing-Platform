import React, { useEffect, useState, useCallback, useRef } from 'react';
import API from '../utils/api';

const categories = [
  { key: 'general',       label: 'World',         icon: '🌍', gradient: 'from-blue-500 to-indigo-600',    light: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  { key: 'sports',        label: 'Sports',         icon: '⚽', gradient: 'from-green-500 to-emerald-600',  light: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
  { key: 'technology',    label: 'Technology',     icon: '💻', gradient: 'from-violet-500 to-purple-600',  light: 'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300' },
  { key: 'health',        label: 'Health',         icon: '🏥', gradient: 'from-rose-500 to-pink-600',      light: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300' },
  { key: 'business',      label: 'Business',       icon: '💼', gradient: 'from-amber-500 to-orange-600',   light: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  { key: 'education',     label: 'Education',      icon: '🎓', gradient: 'from-sky-500 to-cyan-600',       light: 'bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300' },
  { key: 'science',       label: 'Science',        icon: '🔬', gradient: 'from-teal-500 to-green-600',     light: 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300' },
  { key: 'entertainment', label: 'Entertainment',  icon: '🎬', gradient: 'from-fuchsia-500 to-pink-600',   light: 'bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-300' },
];

const timeAgo = (dateStr) => {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const SkeletonNewsCard = () => (
  <div className="card overflow-hidden animate-pulse">
    <div className="h-44 bg-slate-200 dark:bg-slate-700" />
    <div className="p-4 space-y-3">
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/5" />
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/5" />
    </div>
  </div>
);

const NewsCard = ({ article, gradient }) => (
  <a
    href={article.url}
    target="_blank"
    rel="noopener noreferrer"
    className="group card flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
  >
    <div className="relative overflow-hidden">
      {article.image ? (
        <img
          src={article.image}
          alt={article.title}
          className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
        />
      ) : null}
      <div className={`h-44 w-full bg-gradient-to-br ${gradient} items-center justify-center text-5xl ${article.image ? 'hidden' : 'flex'}`}>
        📰
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-2 right-2 rounded-lg bg-black/50 px-2 py-1 text-xs text-white backdrop-blur-sm">
        {article.source?.name}
      </div>
    </div>
    <div className="flex flex-1 flex-col p-4">
      <h3 className="mb-2 line-clamp-2 font-bold leading-snug text-slate-800 group-hover:text-indigo-600 transition dark:text-slate-100">
        {article.title}
      </h3>
      <p className="line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400 flex-1">
        {article.description}
      </p>
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-700">
        <span className="text-xs text-slate-400">{timeAgo(article.publishedAt)}</span>
        <span className="flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:gap-2 transition-all">
          Read more
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </div>
  </a>
);

const News = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const activeCat = categories.find(c => c.key === activeCategory);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const params = search ? { q: search } : { category: activeCategory };
      const { data } = await API.get('/news', { params });
      setNews(data.articles || []);
    } catch {
      setNews([]);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, search]);

  useEffect(() => { fetchNews(); }, [fetchNews]);

  // Close sidebar on outside click
  useEffect(() => {
    const handler = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) setSidebarOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleCategoryClick = (key) => {
    setActiveCategory(key);
    setSearch('');
    setSearchInput('');
    setSidebarOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  return (
    <div className="page-container">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Header */}
        <div className={`mb-6 overflow-hidden rounded-3xl bg-gradient-to-r ${activeCat?.gradient} p-6 shadow-xl transition-all duration-500`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {/* Category toggle button */}
              <button
                onClick={() => setSidebarOpen(o => !o)}
                className="flex h-12 w-12 flex-col items-center justify-center gap-1.5 rounded-2xl bg-white/20 backdrop-blur-sm transition hover:bg-white/30 flex-shrink-0"
                aria-label="Toggle categories"
              >
                <span className={`block h-0.5 w-5 rounded-full bg-white transition-all duration-300 ${sidebarOpen ? 'translate-y-2 rotate-45' : ''}`} />
                <span className={`block h-0.5 w-5 rounded-full bg-white transition-all duration-300 ${sidebarOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-0.5 w-5 rounded-full bg-white transition-all duration-300 ${sidebarOpen ? '-translate-y-2 -rotate-45' : ''}`} />
              </button>
              <div>
                <p className="text-sm font-medium text-white/70">Live updates</p>
                <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
                  {activeCat?.icon} {activeCat?.label} News
                </h1>
                <p className="mt-0.5 text-sm text-white/60">Real-time news from around the world</p>
              </div>
            </div>
            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="Search news..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="rounded-xl border-0 bg-white/20 px-4 py-2.5 text-sm text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50 w-44 sm:w-56"
              />
              <button type="submit" className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-800 hover:bg-white/90 transition">
                Search
              </button>
              {search && (
                <button type="button" onClick={() => { setSearch(''); setSearchInput(''); }} className="rounded-xl bg-white/20 px-3 py-2.5 text-sm text-white hover:bg-white/30 transition">
                  ✕
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Results count */}
        {!loading && (
          <p className="mb-4 text-sm text-slate-400">
            {search ? `Search results for "${search}"` : `Top ${activeCat?.label} headlines`} — {news.length} articles
          </p>
        )}

        {/* News Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => <SkeletonNewsCard key={i} />)}
          </div>
        ) : news.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {news.map((article, i) => (
              <NewsCard key={i} article={article} gradient={activeCat?.gradient} />
            ))}
          </div>
        ) : (
          <div className="card p-14 text-center">
            <div className="mb-4 text-5xl">📭</div>
            <h3 className="mb-2 text-lg font-semibold text-slate-700 dark:text-slate-200">No news found</h3>
            <p className="text-slate-400">Try a different category or search term</p>
          </div>
        )}
      </div>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Left Category Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed left-0 top-0 z-50 h-full w-72 bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:bg-slate-900 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Sidebar Header */}
        <div className={`bg-gradient-to-r ${activeCat?.gradient} px-5 py-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Browse</p>
              <h2 className="text-xl font-extrabold text-white">News Categories</h2>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30 transition"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Category List */}
        <div className="p-3 space-y-1 overflow-y-auto">
          {categories.map((cat, i) => (
            <button
              key={cat.key}
              onClick={() => handleCategoryClick(cat.key)}
              style={{ transitionDelay: sidebarOpen ? `${i * 40}ms` : '0ms' }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                sidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
              } ${
                activeCategory === cat.key && !search
                  ? `bg-gradient-to-r ${cat.gradient} text-white shadow-md`
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl flex-shrink-0 ${
                activeCategory === cat.key && !search ? 'bg-white/20' : cat.light
              }`}>
                {cat.icon}
              </span>
              <div className="text-left">
                <p className="font-bold">{cat.label}</p>
                <p className={`text-xs ${activeCategory === cat.key && !search ? 'text-white/70' : 'text-slate-400'}`}>
                  Top headlines
                </p>
              </div>
              {activeCategory === cat.key && !search && (
                <span className="ml-auto h-2 w-2 rounded-full bg-white" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;
