import { useState, useEffect } from 'react';
import API from '../utils/api';
import PostCard from '../components/PostCard';

export default function Trending() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    try {
      const { data } = await API.get('/posts/trending');
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch trending posts');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">🔥 Trending Posts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
