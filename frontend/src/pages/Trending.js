import { useState, useEffect } from 'react';
import API from '../utils/api';
import PostCard from '../components/PostCard';

const SkeletonCard = () => (
  <div className="card overflow-hidden animate-pulse">
    <div className="h-36 bg-slate-200 dark:bg-slate-700" />
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
      </div>
      <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded" />
      <div className="h-4 w-4/5 bg-slate-200 dark:bg-slate-700 rounded" />
      <div className="h-3 w-2/5 bg-slate-200 dark:bg-slate-700 rounded" />
    </div>
  </div>
);

export default function Trending() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/posts/trending')
      .then(({ data }) => setPosts(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Header */}
        <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-rose-500 to-pink-600 p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/70">Community picks</p>
              <h1 className="text-2xl font-extrabold text-white sm:text-3xl">🔥 Trending Posts</h1>
              <p className="mt-1 text-sm text-white/60">Most viewed and liked content right now</p>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <div className="rounded-2xl bg-white/10 px-4 py-3 text-center backdrop-blur-sm">
                <p className="text-lg font-black text-white">{posts.length}</p>
                <p className="text-[11px] font-medium text-white/60">Posts</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-4 py-3 text-center backdrop-blur-sm">
                <p className="text-lg font-black text-white">
                  {posts.reduce((a, p) => a + (p.likes?.length || 0), 0)}
                </p>
                <p className="text-[11px] font-medium text-white/60">Total Likes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top 3 podium */}
        {!loading && posts.length >= 3 && (
          <div className="mb-8 grid grid-cols-3 gap-4">
            {[posts[1], posts[0], posts[2]].map((post, i) => {
              const podiumRank = [2, 1, 3][i];
              const heights = ['h-16', 'h-24', 'h-12'];
              const colors = ['bg-slate-300', 'bg-amber-400', 'bg-amber-600'];
              const medals = ['🥈', '🥇', '🥉'];
              return (
                <div key={post._id} className="flex flex-col items-center gap-2">
                  <span className="text-2xl">{medals[i]}</span>
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-300 text-center line-clamp-1 max-w-[100px]">{post.title}</p>
                  <div className={`w-full ${heights[i]} ${colors[i]} rounded-t-xl flex items-center justify-center text-white font-black text-lg`}>
                    #{podiumRank}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in">
            {posts.map((post, i) => (
              <PostCard key={post._id} post={post} rank={i + 1} />
            ))}
          </div>
        ) : (
          <div className="card p-16 text-center">
            <div className="text-5xl mb-4">🔥</div>
            <p className="text-slate-500 text-lg dark:text-slate-400">No trending posts yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
