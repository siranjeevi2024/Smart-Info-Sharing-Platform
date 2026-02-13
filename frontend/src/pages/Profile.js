import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import PostCard from '../components/PostCard';
import UserStats from '../components/UserStats';

const Profile = () => {
  const { user } = useAuth();
  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      const { data } = await API.get('/posts');
      const filtered = data.filter(post => post.createdBy._id === user._id);
      setMyPosts(filtered);
    } catch (error) {
      console.error('Failed to fetch posts');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-4xl">
                  {user.username[0].toUpperCase()}
                </div>
              )}
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = async () => {
                        try {
                          await API.put('/users/avatar', { avatar: reader.result });
                          window.location.reload();
                        } catch (error) {
                          console.error('Failed to update avatar');
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                📷
              </label>
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user.username}</h1>
              <p className="text-gray-600">{user.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {user.role}
              </span>
            </div>
          </div>
          <UserStats />
        </div>

        <h2 className="text-2xl font-bold mb-6">My Posts ({myPosts.length})</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myPosts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>

        {myPosts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            You haven't created any posts yet
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;