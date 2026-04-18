import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { toast } from 'react-toastify';

const categories = ['Technology', 'Science', 'Business', 'Education', 'Health', 'Other'];
const categoryIcons = { Technology: '💻', Science: '🔬', Business: '📈', Education: '📚', Health: '❤️', Other: '✨' };

const CreatePost = () => {
  const [formData, setFormData] = useState({ title: '', description: '', category: '', tags: '' });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleImageSelect = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleImageSelect(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) { toast.error('Please select a category'); return; }
    setLoading(true);
    try {
      await API.post('/posts', {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        image: image || null,
      });
      toast.success('Post published!');
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
        <div className="mb-7 animate-slide-up">
          <h1 className="section-title">Create a new post</h1>
          <p className="text-slate-500 mt-1 text-sm">Share your knowledge with the community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 animate-slide-up">
          {/* Title */}
          <div className="card p-5">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Post Title <span className="text-red-400">*</span></label>
            <input
              type="text"
              required
              placeholder="Write a compelling title..."
              className="input-field text-base font-medium"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Image Upload */}
          <div className="card p-5">
            <label className="block text-sm font-semibold text-slate-700 mb-3">Cover Image <span className="text-slate-400 font-normal">(optional)</span></label>

            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden">
                <img src={imagePreview} alt="Preview" className="w-full h-56 object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-white text-slate-800 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-100 transition">
                    Change
                  </button>
                  <button type="button" onClick={() => { setImage(null); setImagePreview(null); }} className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-600 transition">
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                  dragOver ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'
                }`}
              >
                <div className="text-4xl mb-3">🖼️</div>
                <p className="text-sm font-semibold text-slate-600 mb-1">Drop image here or click to upload</p>
                <p className="text-xs text-slate-400">PNG, JPG, GIF up to 5MB</p>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageSelect(e.target.files[0])} />
          </div>

          {/* Content */}
          <div className="card p-5">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Content <span className="text-red-400">*</span></label>
            <textarea
              required
              rows="7"
              placeholder="Share your thoughts, insights, or knowledge..."
              className="input-field resize-none leading-relaxed"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <p className="text-xs text-slate-400 mt-1 text-right">{formData.description.length} characters</p>
          </div>

          {/* Category */}
          <div className="card p-5">
            <label className="block text-sm font-semibold text-slate-700 mb-3">Category <span className="text-red-400">*</span></label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat })}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all active:scale-95 ${
                    formData.category === cat
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 text-slate-600 hover:border-indigo-300'
                  }`}
                >
                  <span>{categoryIcons[cat]}</span> {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="card p-5">
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

          {/* Submit */}
          <div className="flex gap-3 pb-4">
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2 py-3">
              {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Publishing...</> : '🚀 Publish Post'}
            </button>
            <button type="button" onClick={() => navigate('/')} className="btn-secondary flex-1 py-3">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
