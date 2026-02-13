import { useState, useEffect } from 'react';
import API from '../utils/api';
import { Link } from 'react-router-dom';

export default function UserStats() {
  const [stats, setStats] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const [modalData, setModalData] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/users/stats');
      console.log('Stats received:', data);
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleStatClick = async (type) => {
    try {
      if (type === 'followers' || type === 'following') {
        const { data } = await API.get('/auth/me');
        setModalData(data[type] || []);
      } else if (type === 'likes') {
        console.log('Likers data:', stats.likers);
        setModalData(stats.likers || []);
      } else if (type === 'views') {
        console.log('Viewers data:', stats.viewers);
        console.log('Stats object:', stats);
        setModalData(stats.viewers || []);
      } else if (type === 'posts') {
        setModalData(stats.posts || []);
      }
      setShowModal(type);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  if (!stats) return null;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div 
          onClick={() => handleStatClick('posts')}
          className="bg-blue-50 p-4 rounded-lg text-center cursor-pointer hover:bg-blue-100 transition"
        >
          <div className="text-2xl font-bold text-blue-600">{stats.totalPosts}</div>
          <div className="text-sm text-gray-600">Posts</div>
        </div>
        <div 
          onClick={() => handleStatClick('likes')}
          className="bg-red-50 p-4 rounded-lg text-center cursor-pointer hover:bg-red-100 transition"
        >
          <div className="text-2xl font-bold text-red-600">{stats.totalLikes}</div>
          <div className="text-sm text-gray-600">Likes</div>
        </div>
        <div 
          onClick={() => handleStatClick('comments')}
          className="bg-green-50 p-4 rounded-lg text-center cursor-pointer hover:bg-green-100 transition"
        >
          <div className="text-2xl font-bold text-green-600">{stats.totalComments}</div>
          <div className="text-sm text-gray-600">Comments</div>
        </div>
        <div 
          onClick={() => handleStatClick('views')}
          className="bg-purple-50 p-4 rounded-lg text-center cursor-pointer hover:bg-purple-100 transition"
        >
          <div className="text-2xl font-bold text-purple-600">{stats.totalViews}</div>
          <div className="text-sm text-gray-600">Views</div>
        </div>
        <div 
          onClick={() => handleStatClick('followers')}
          className="bg-indigo-50 p-4 rounded-lg text-center cursor-pointer hover:bg-indigo-100 transition"
        >
          <div className="text-2xl font-bold text-indigo-600">{stats.followers}</div>
          <div className="text-sm text-gray-600">Followers</div>
        </div>
        <div 
          onClick={() => handleStatClick('following')}
          className="bg-pink-50 p-4 rounded-lg text-center cursor-pointer hover:bg-pink-100 transition"
        >
          <div className="text-2xl font-bold text-pink-600">{stats.following}</div>
          <div className="text-sm text-gray-600">Following</div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowModal(null)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold capitalize">{showModal}</h3>
              <button onClick={() => setShowModal(null)} className="text-2xl">&times;</button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {showModal === 'posts' && (
                <div className="space-y-3">
                  {modalData.length > 0 ? (
                    modalData.map(post => (
                      <Link
                        key={post._id}
                        to={`/post/${post._id}`}
                        className="block p-3 hover:bg-gray-50 rounded border"
                        onClick={() => setShowModal(null)}
                      >
                        <div className="font-semibold mb-2">{post.title}</div>
                        <div className="flex gap-4 text-sm text-gray-600">
                          <span>👁️ {post.views}</span>
                          <span>❤️ {post.likes.length}</span>
                          <span>💬 {post.comments.length}</span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-gray-500 text-center py-4">No posts yet</div>
                  )}
                </div>
              )}
              {showModal === 'likes' && (
                <div className="space-y-2">
                  {modalData && modalData.length > 0 ? (
                    modalData.map((user, index) => (
                      user && user._id ? (
                        <Link 
                          key={user._id} 
                          to={`/user/${user._id}`}
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded"
                          onClick={() => setShowModal(null)}
                        >
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                            {user.username ? user.username[0].toUpperCase() : '?'}
                          </div>
                          <div>
                            <div className="font-semibold">{user.username || 'Unknown'}</div>
                            <div className="text-sm text-gray-500">{user.email || ''}</div>
                          </div>
                        </Link>
                      ) : (
                        <div key={index} className="text-gray-400 text-sm p-2">Invalid user data</div>
                      )
                    ))
                  ) : (
                    <div className="text-gray-500 text-center py-4">
                      No likes yet (Total likes: {stats.totalLikes})
                    </div>
                  )}
                </div>
              )}
              {showModal === 'comments' && (
                <div className="text-gray-600">
                  Your posts received {stats.totalComments} comments in total
                </div>
              )}
              {showModal === 'views' && (
                <div className="space-y-2">
                  {modalData && modalData.length > 0 ? (
                    modalData.map((user, index) => (
                      user && user._id ? (
                        <Link 
                          key={user._id} 
                          to={`/user/${user._id}`}
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded"
                          onClick={() => setShowModal(null)}
                        >
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                            {user.username ? user.username[0].toUpperCase() : '?'}
                          </div>
                          <div>
                            <div className="font-semibold">{user.username || 'Unknown'}</div>
                            <div className="text-sm text-gray-500">{user.email || ''}</div>
                          </div>
                        </Link>
                      ) : (
                        <div key={index} className="text-gray-400 text-sm p-2">Invalid user data</div>
                      )
                    ))
                  ) : (
                    <div className="text-gray-500 text-center py-4">
                      <div className="mb-2">Total views: {stats.totalViews}</div>
                      <div className="text-sm">Only logged-in viewers are tracked. View your posts while logged in to see who viewed them.</div>
                    </div>
                  )}
                </div>
              )}
              {(showModal === 'followers' || showModal === 'following') && (
                <div className="space-y-2">
                  {modalData.length > 0 ? (
                    modalData.map(user => (
                      <Link 
                        key={user._id} 
                        to={`/user/${user._id}`}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded"
                        onClick={() => setShowModal(null)}
                      >
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                          {user.username[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold">{user.username}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-gray-500 text-center py-4">
                      No {showModal} yet
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
