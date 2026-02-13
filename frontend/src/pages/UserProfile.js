import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import PostCard from '../components/PostCard';

export default function UserProfile() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get(`/users/profile/${userId}`);
      setProfile(data);
      setFollowing(data.user.followers.some(f => f._id === currentUser?._id));
    } catch (error) {
      console.error('Failed to fetch profile');
    }
  };

  const handleFollow = async () => {
    try {
      const { data } = await API.post(`/users/follow/${userId}`);
      setFollowing(data.following);
      fetchProfile();
    } catch (error) {
      console.error('Failed to follow/unfollow');
    }
  };

  if (!profile) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-4xl">
                {profile.user.username[0].toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{profile.user.username}</h1>
                <p className="text-gray-600">{profile.user.email}</p>
                {profile.user.bio && <p className="text-gray-500 mt-2">{profile.user.bio}</p>}
              </div>
            </div>
            {currentUser && currentUser._id !== userId && (
              <button
                onClick={handleFollow}
                className={`px-6 py-2 rounded-lg font-semibold ${
                  following
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {following ? '✓ Following' : '+ Follow'}
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{profile.user.followers.length}</div>
              <div className="text-gray-600">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{profile.user.following.length}</div>
              <div className="text-gray-600">Following</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{profile.posts.length}</div>
              <div className="text-gray-600">Posts</div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profile.posts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
