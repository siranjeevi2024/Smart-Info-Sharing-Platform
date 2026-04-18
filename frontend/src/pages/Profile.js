import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import PostCard from '../components/PostCard';
import UserStats from '../components/UserStats';

const Profile = () => {
  const { user } = useAuth();
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    API.get('/posts')
      .then(({ data }) => setMyPosts(data.filter(p => p.createdBy._id === user._id)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        await API.put('/users/avatar', { avatar: reader.result });
        window.location.reload();
      } catch {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="page-container">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Profile Header */}
        <div className="card overflow-hidden mb-6 animate-slide-up">
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-12 mb-4">
              {/* Avatar */}
              <div className="relative">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg" />
                ) : (
                  <div className="w-24 h-24 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
                    {user.username[0].toUpperCase()}
                  </div>
                )}
                <label className={`absolute -bottom-1 -right-1 w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition shadow-md ${uploading ? 'opacity-50' : ''}`}>
                  {uploading ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <span className="text-sm">📷</span>}
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={uploading} />
                </label>
              </div>

              <Link to="/create" className="btn-primary text-sm py-2 px-4">✏️ New Post</Link>
            </div>

            <div className="mb-4">
              <h1 className="text-2xl font-bold text-slate-900">{user.username}</h1>
              <p className="text-slate-500 text-sm">{user.email}</p>
              <span className="inline-flex items-center gap-1 mt-2 badge bg-indigo-100 text-indigo-700 capitalize">
                {user.role === 'admin' ? '⚙️' : '👤'} {user.role}
              </span>
            </div>

            <UserStats />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl p-1 border border-slate-100 shadow-sm mb-6">
          {[
            { id: 'posts', label: `Posts (${myPosts.length})`, icon: '📝' },
            { id: 'activity', label: 'Activity', icon: '⚡' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'posts' && (
          loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card p-5 space-y-3">
                  <div className="skeleton h-4 w-3/4" />
                  <div className="skeleton h-4 w-full" />
                  <div className="skeleton h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : myPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in">
              {myPosts.map(post => <PostCard key={post._id} post={post} />)}
            </div>
          ) : (
            <div className="card p-14 text-center animate-fade-in">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No posts yet</h3>
              <p className="text-slate-400 mb-5">Share your first piece of knowledge!</p>
              <Link to="/create" className="btn-primary inline-flex">Create your first post</Link>
            </div>
          )
        )}

        {activeTab === 'activity' && (
          <div className="card p-14 text-center animate-fade-in">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Activity coming soon</h3>
            <p className="text-slate-400">Your recent activity will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
