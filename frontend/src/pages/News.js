import React, { useEffect, useState, useCallback } from 'react';
import API from '../utils/api';

const categories = [
  { key: 'general',       label: 'World',         icon: '🌍' },
  { key: 'sports',        label: 'Sports',         icon: '⚽' },
  { key: 'technology',    label: 'Technology',     icon: '💻' },
  { key: 'health',        label: 'Health',         icon: '🏥' },
  { key: 'business',      label: 'Business',       icon: '💼' },
  { key: 'education',     label: 'Education',      icon: '🎓' },
  { key: 'science',       label: 'Science',        icon: '🔬' },
  { key: 'entertainment', label: 'Entertainment',  icon: '🎬' },
];

const categoryColors = {
  general:       'from-blue-500 to-indigo-600',
  sports:        'from-green-500 to-emerald-600',
  technology:    'from-violet-500 to-purple-600',
  health:        'from-rose-500 to-pink-600',
  business:      'from-amber-500 to-orange-600',
  education:     'from-sky-500 to-cyan-600',
  science:       'from-teal-500 to-green-600',
  entertainment: 'from-fuchsia-500 to-pink-600',
};

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
      <div
        className={`h-44 w-full bg-gradient-to-br ${gradient} items-center justify-center text-5xl ${article.image ? 'hidden' : 'flex'}`}
      >
        📰
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const params = search
        ? { q: search }
        : { category: activeCategory };
      const { data } = await API.get('/news', { params });
      setNews(data.articles || []);
    } catch {
      setNews([]);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, search]);

  useEffect(() => { fetchNews(); }, [fetchNews]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const activeCat = categories.find((c) => c.key === activeCategory);
  const gradient = categoryColors[activeCategory];

  return (
    <div className="page-container">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Header */}
        <div className={`mb-6 overflow-hidden rounded-3xl bg-gradient-to-r ${gradient} p-6 shadow-xl`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-white/70">Live updates</p>
              <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
                {activeCat?.icon} {activeCat?.label} News
              </h1>
              <p className="mt-1 text-sm text-white/60">Real-time news from around the world</p>
            </div>
            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="Search news..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="rounded-xl border-0 bg-white/20 px-4 py-2.5 text-sm text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50 w-48 sm:w-64"
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

        {/* Category Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => { setActiveCategory(cat.key); setSearch(''); setSearchInput(''); }}
              className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-all active:scale-95 ${
                activeCategory === cat.key && !search
                  ? `bg-gradient-to-r ${categoryColors[cat.key]} text-white shadow-md`
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
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
              <NewsCard key={i} article={article} gradient={gradient} />
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
    </div>
  );
};

export default News;
