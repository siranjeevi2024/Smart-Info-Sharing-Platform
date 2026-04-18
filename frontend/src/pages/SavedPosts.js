import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import PostCard from '../components/PostCard';

const SavedPosts = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/posts/saved')
      .then(({ data }) => setSavedPosts(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <div className="container mx-auto px-4">
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center text-xl">🔖</div>
            <div>
              <h1 className="section-title">Saved Posts</h1>
              <p className="text-slate-500 text-sm">{savedPosts.length} post{savedPosts.length !== 1 ? 's' : ''} saved</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card p-6 space-y-3">
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : savedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {savedPosts.map(post => <PostCard key={post._id} post={post} />)}
          </div>
        ) : (
          <div className="card p-16 text-center animate-fade-in">
            <div className="text-5xl mb-4">🔖</div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No saved posts yet</h3>
            <p className="text-slate-400">Posts you save will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPosts;
