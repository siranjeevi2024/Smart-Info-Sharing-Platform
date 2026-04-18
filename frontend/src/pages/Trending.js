import { useState, useEffect } from 'react';
import API from '../utils/api';
import PostCard from '../components/PostCard';

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
      <div className="container mx-auto px-4">
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-xl">🔥</div>
            <div>
              <h1 className="section-title">Trending Posts</h1>
              <p className="text-slate-500 text-sm">Most popular content right now</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-6 space-y-3">
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {posts.map(post => <PostCard key={post._id} post={post} />)}
          </div>
        ) : (
          <div className="card p-16 text-center">
            <div className="text-5xl mb-4">🔥</div>
            <p className="text-slate-500 text-lg">No trending posts yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
