import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';
import Broadcast from '../components/Broadcast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchDashboard();
    fetchUsers();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await API.get('/admin/dashboard');
      setStats(data);
    } catch (error) {
      toast.error('Failed to fetch dashboard');
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/admin/users');
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      await API.put(`/admin/users/${userId}/block`);
      fetchUsers();
      toast.success('User status updated!');
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Delete this user and all their posts?')) {
      try {
        await API.delete(`/admin/users/${userId}`);
        fetchUsers();
        toast.success('User deleted!');
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  if (!stats) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-gray-500 text-sm mb-2">Total Users</h3>
            <p className="text-4xl font-bold text-blue-600">{stats.totalUsers}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-gray-500 text-sm mb-2">Total Posts</h3>
            <p className="text-4xl font-bold text-green-600">{stats.totalPosts}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-gray-500 text-sm mb-2">Blocked Users</h3>
            <p className="text-4xl font-bold text-red-600">{stats.blockedUsers}</p>
          </div>
        </div>

        <div className="mb-8">
          <Broadcast />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Recent Posts</h2>
          <div className="space-y-4">
            {stats.recentPosts.map(post => (
              <div key={post._id} className="border-b pb-4">
                <h3 className="font-semibold">{post.title}</h3>
                <p className="text-sm text-gray-600">
                  By {post.createdBy.username} • {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">All Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Username</th>
                  <th className="text-left py-3">Email</th>
                  <th className="text-left py-3">Role</th>
                  <th className="text-left py-3">Status</th>
                  <th className="text-left py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} className="border-b">
                    <td className="py-3">{user.username}</td>
                    <td className="py-3">{user.email}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="py-3">
                      {user.role !== 'admin' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleBlockUser(user._id)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                          >
                            {user.isBlocked ? 'Unblock' : 'Block'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;