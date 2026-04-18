import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { toast } from 'react-toastify';

const categories = ['Technology', 'Science', 'Business', 'Education', 'Health', 'Other'];

const categoryIcons = {
  Technology: '💻', Science: '🔬', Business: '📈',
  Education: '📚', Health: '❤️', Other: '✨'
};

const CreatePost = () => {
  const [formData, setFormData] = useState({ title: '', description: '', category: '', tags: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/posts', {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      });
      toast.success('Post published successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8 animate-slide-up">
          <h1 className="section-title">Create a new post</h1>
          <p className="text-slate-500 mt-1">Share your knowledge with the community</p>
        </div>

        <div className="card p-8 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Post Title</label>
              <input
                type="text"
                required
                placeholder="Write a compelling title..."
                className="input-field text-lg font-medium"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Content</label>
              <textarea
                required
                rows="8"
                placeholder="Share your thoughts, insights, or knowledge..."
                className="input-field resize-none leading-relaxed"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <p className="text-xs text-slate-400 mt-1">{formData.description.length} characters</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Category</label>
              <div className="grid grid-cols-3 gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                      formData.category === cat
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span>{categoryIcons[cat]}</span> {cat}
                  </button>
                ))}
              </div>
              {!formData.category && <p className="text-xs text-red-400 mt-1">Please select a category</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Tags <span className="text-slate-400 font-normal">(comma separated)</span>
              </label>
              <input
                type="text"
                placeholder="react, javascript, tutorial"
                className="input-field"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
              {formData.tags && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {formData.tags.split(',').map(t => t.trim()).filter(Boolean).map((tag, i) => (
                    <span key={i} className="badge bg-indigo-100 text-indigo-700">#{tag}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Publishing...</>
                ) : '🚀 Publish Post'}
              </button>
              <button type="button" onClick={() => navigate('/')} className="btn-secondary flex-1">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
