import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import PostCard from '../components/PostCard';

const SavedPosts = () => {
  const [savedPosts, setSavedPosts] = useState([]);

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  const fetchSavedPosts = async () => {
    try {
      const { data } = await API.get('/posts/saved');
      setSavedPosts(data);
    } catch (error) {
      console.error('Failed to fetch saved posts');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Saved Posts</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedPosts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>

        {savedPosts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No saved posts yet
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPosts;