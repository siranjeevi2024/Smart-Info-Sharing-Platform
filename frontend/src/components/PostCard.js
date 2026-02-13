import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PostCard = ({ post }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [following, setFollowing] = React.useState(false);

  const handleMessage = (e) => {
    e.preventDefault();
    if (user) {
      navigate(`/messages/${post.createdBy._id}`);
    } else {
      navigate('/login');
    }
  };

  const handleFollow = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const API = (await import('../utils/api')).default;
      const { data } = await API.post(`/users/follow/${post.createdBy._id}`);
      setFollowing(data.following);
    } catch (error) {
      console.error('Failed to follow/unfollow');
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <Link to={`/user/${post.createdBy?._id}`} className="flex items-center gap-3">
            {post.createdBy?.avatar ? (
              <img src={post.createdBy.avatar} alt={post.createdBy.username} className="w-12 h-12 rounded-full" />
            ) : (
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {post.createdBy?.username[0].toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-900">{post.createdBy?.username}</p>
              <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
            </div>
          </Link>
          <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
            {post.category}
          </span>
        </div>

        {/* Content */}
        <Link to={`/post/${post._id}`}>
          <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition">
            {post.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-2">
            {post.description}
          </p>
        </Link>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {post.views || 0}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {post.likes?.length || 0}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {post.comments?.length || 0}
          </span>
        </div>

        {/* Actions */}
        {user && post.createdBy?._id !== user._id && (
          <div className="flex gap-2 pt-4 border-t">
            <button
              onClick={handleFollow}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              {following ? 'Following' : 'Follow'}
            </button>
            <button
              onClick={handleMessage}
              className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Message
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;