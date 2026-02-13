import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { toast } from 'react-toastify';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: ''
  });
  const navigate = useNavigate();

  const categories = ['Technology', 'Science', 'Business', 'Education', 'Health', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      await API.post('/posts', postData);
      toast.success('Post created successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create post');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6">Create New Post</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              required
              rows="6"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
            <input
              type="text"
              placeholder="react, javascript, tutorial"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Create Post
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;