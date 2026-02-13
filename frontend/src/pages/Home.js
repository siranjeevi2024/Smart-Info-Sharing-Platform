import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import API from '../utils/api';
import PostCard from '../components/PostCard';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import Landing from './Landing';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('latest');
  const [trendingPosts, setTrendingPosts] = useState([]);
  const { user } = useAuth();

  const categories = ['Technology', 'Science', 'Business', 'Education', 'Health', 'Other'];

  useEffect(() => {
    fetchPosts();
    fetchTrending();

    const socket = io('http://localhost:5002');
    socket.on('newPost', (newPost) => {
      setPosts(prev => [newPost, ...prev]);
      toast.info('New post added!');
    });

    return () => socket.disconnect();
  }, []);

  const fetchPosts = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (sort) params.sort = sort;

      const { data } = await API.get('/posts', { params });
      setPosts(data);
    } catch (error) {
      toast.error('Failed to fetch posts');
    }
  };

  const fetchTrending = async () => {
    try {
      const { data } = await API.get('/posts/trending');
      setTrendingPosts(data.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch trending');
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchTrending();
  }, [search, category, sort]);

  if (!user) {
    return <Landing />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Hero Section */}
            {user && (
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 mb-8 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Welcome back, {user.username}! 👋</h2>
                    <p className="text-indigo-100">Discover and share amazing content with the community</p>
                  </div>
                  <Link to="/create" className="hidden md:block bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:shadow-xl transition">
                    Create New Post
                  </Link>
                </div>
              </div>
            )}

            {/* Categories Bar */}
            <div className="bg-white rounded-3xl shadow-xl p-4 mb-6">
              <div className="flex gap-2 overflow-x-auto">
                <button
                  onClick={() => setCategory('')}
                  className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition ${
                    category === '' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition ${
                      category === cat ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Search & Sort */}
            <div className="bg-white rounded-3xl shadow-xl p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search posts..."
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <select
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="latest">Latest First</option>
                  <option value="trending">Most Popular</option>
                </select>
              </div>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.length > 0 ? (
                posts.map(post => <PostCard key={post._id} post={post} />)
              ) : (
                <div className="col-span-full">
                  <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
                    <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-500 text-lg mb-4">
                      {search || category ? 
                        `No posts found for "${search}" ${category ? `in ${category}` : ''}` : 
                        'No posts available'
                      }
                    </p>
                    {(search || category) && (
                      <button 
                        onClick={() => { setSearch(''); setCategory(''); }}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition font-medium"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block w-80">
            {/* Trending Posts */}
            <div className="bg-white rounded-3xl shadow-xl p-6 mb-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                Trending Now
              </h3>
              <div className="space-y-4">
                {trendingPosts.map((post, index) => (
                  <Link key={post._id} to={`/post/${post._id}`} className="block group">
                    <div className="flex gap-3">
                      <span className="text-2xl font-bold text-gray-300">#{index + 1}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition line-clamp-2">
                          {post.title}
                        </h4>
                        <div className="flex gap-3 text-xs text-gray-500 mt-1">
                          <span>👁️ {post.views}</span>
                          <span>❤️ {post.likes?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;