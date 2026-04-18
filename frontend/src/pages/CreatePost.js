import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { toast } from 'react-toastify';

const categories = ['Technology', 'Science', 'Business', 'Education', 'Health', 'Other'];
const categoryIcons = { Technology: '💻', Science: '🔬', Business: '📈', Education: '📚', Health: '❤️', Other: '✨' };

const AIAssistant = ({ title, description, onApplyTags }) => {
  const [activeTab, setActiveTab] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'grammar', label: 'Grammar Check', icon: '✅' },
    { id: 'improve', label: 'Improve', icon: '✨' },
    { id: 'expand', label: 'Expand Ideas', icon: '💡' },
    { id: 'tags', label: 'Auto Tags', icon: '🏷️' },
  ];

  const handleAction = async (action) => {
    if (!description && !title) { toast.error('Write some content first'); return; }
    if (activeTab === action && result) { setActiveTab(null); setResult(null); return; }
    setActiveTab(action);
    setResult(null);
    setLoading(true);
    try {
      const { data } = await API.post('/ai/assist', { title, description, action });
      setResult(data);
    } catch {
      toast.error('AI assistant failed');
      setActiveTab(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <div>
            <h3 className="font-bold text-white text-sm">AI Writing Assistant</h3>
            <p className="text-violet-200 text-xs">Powered by smart analysis</p>
          </div>
        </div>
      </div>

      {/* Action Tabs */}
      <div className="grid grid-cols-4 gap-0 border-b border-slate-100">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleAction(tab.id)}
            className={`flex flex-col items-center gap-1 py-3 px-2 text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-violet-50 text-violet-700 border-b-2 border-violet-600'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <span className="text-base">{tab.icon}</span>
            <span className="hidden sm:block text-center leading-tight">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Results */}
      {(loading || result) && (
        <div className="p-5 animate-slide-up">
          {loading ? (
            <div className="space-y-2">
              <div className="skeleton h-3 w-full" />
              <div className="skeleton h-3 w-4/5" />
              <div className="skeleton h-3 w-3/5" />
            </div>
          ) : result && (
            <>
              {/* Grammar Results */}
              {activeTab === 'grammar' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="badge bg-blue-100 text-blue-700">📝 {result.wordCount} words</span>
                    <span className="badge bg-green-100 text-green-700">📖 {result.sentenceCount} sentences</span>
                    <span className="badge bg-violet-100 text-violet-700">{result.readability}</span>
                  </div>
                  {result.fixes?.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Suggestions</p>
                      {result.fixes.map((fix, i) => (
                        <div key={i} className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                          <span className="badge bg-amber-100 text-amber-700 mb-2">{fix.issue}</span>
                          <p className="text-xs text-slate-500 line-through mb-1">{fix.original.slice(0, 60)}...</p>
                          <p className="text-xs text-green-700 font-medium">✓ {fix.suggestion.slice(0, 60)}...</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-3">
                      <div className="text-3xl mb-2">🎉</div>
                      <p className="text-sm font-semibold text-green-700">Looks great! No major issues found.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Improve Results */}
              {activeTab === 'improve' && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Writing Improvements</p>
                  {result.suggestions?.length > 0 ? result.suggestions.map((s, i) => (
                    <div key={i} className="flex gap-3 p-3 bg-slate-50 rounded-xl">
                      <span className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                      <div>
                        <p className="text-xs font-bold text-slate-700 mb-0.5">{s.type}</p>
                        <p className="text-xs text-red-500 line-through mb-1">{s.weak}</p>
                        <p className="text-xs text-green-700">→ {s.strong}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-3">
                      <div className="text-3xl mb-2">⭐</div>
                      <p className="text-sm font-semibold text-green-700">Your writing looks polished!</p>
                    </div>
                  )}
                </div>
              )}

              {/* Expand Results */}
              {activeTab === 'expand' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="badge bg-slate-100 text-slate-600">Current: {result.currentWordCount} words</span>
                    <span>→</span>
                    <span className="badge bg-green-100 text-green-700">Target: {result.suggestedWordCount}+ words</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Ideas to Add</p>
                    <div className="space-y-2">
                      {result.expansions?.map((exp, i) => (
                        <div key={i} className="text-xs text-slate-700 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2">{exp}</div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Subtopics to Cover</p>
                    <div className="space-y-1">
                      {result.subtopics?.map((sub, i) => (
                        <p key={i} className="text-xs text-slate-600">{sub}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tags Results */}
              {activeTab === 'tags' && (
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Suggested Tags</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {result.tags?.map((tag, i) => (
                      <span key={i} className="badge bg-indigo-100 text-indigo-700 cursor-default">#{tag}</span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => { onApplyTags(result.tags); toast.success('Tags applied!'); }}
                    className="btn-primary text-xs py-2 px-4 w-full"
                  >
                    Apply All Tags
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {!activeTab && !loading && (
        <div className="px-5 py-4 text-center text-xs text-slate-400">
          Click a button above to get AI suggestions
        </div>
      )}
    </div>
  );
};

const useSpeechToText = (onResult) => {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const toggle = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { toast.error('Speech recognition not supported in this browser'); return; }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join(' ');
      onResult(transcript);
    };
    recognition.onerror = () => { setListening(false); toast.error('Microphone error'); };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  return { listening, toggle };
};

const CreatePost = () => {
  const [formData, setFormData] = useState({ title: '', description: '', category: '', tags: '' });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const { listening, toggle: toggleMic } = useSpeechToText((transcript) =>
    setFormData((prev) => ({ ...prev, description: prev.description ? prev.description + ' ' + transcript : transcript }))
  );

  const handleImageSelect = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    const reader = new FileReader();
    reader.onloadend = () => { setImage(reader.result); setImagePreview(reader.result); };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleImageSelect(e.dataTransfer.files[0]);
  };

  const handleApplyTags = useCallback((tags) => {
    setFormData(prev => ({ ...prev, tags: tags.join(', ') }));
  }, []);

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
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-7 animate-slide-up">
          <h1 className="section-title">Create a new post</h1>
          <p className="text-slate-500 mt-1 text-sm">Share your knowledge with the community</p>
        </div>

        <div className="flex gap-6">
          {/* Left - Form */}
          <form onSubmit={handleSubmit} className="flex-1 space-y-5 animate-slide-up">
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
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-white text-slate-800 px-4 py-2 rounded-xl text-sm font-semibold">Change</button>
                    <button type="button" onClick={() => { setImage(null); setImagePreview(null); }} className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-semibold">Remove</button>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${dragOver ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'}`}
                >
                  <div className="text-3xl mb-2">🖼️</div>
                  <p className="text-sm font-semibold text-slate-600 mb-1">Drop image here or click to upload</p>
                  <p className="text-xs text-slate-400">PNG, JPG, GIF up to 5MB</p>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageSelect(e.target.files[0])} />
            </div>

            {/* Content */}
            <div className="card p-5">
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-sm font-semibold text-slate-700">Content <span className="text-red-400">*</span></label>
                <button
                  type="button"
                  onClick={toggleMic}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                    listening
                      ? 'animate-pulse bg-red-100 text-red-600 ring-2 ring-red-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
                  }`}
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  {listening ? 'Listening... (click to stop)' : 'Speak to type'}
                </button>
              </div>
              <textarea
                required
                rows="8"
                placeholder="Share your thoughts, insights, or knowledge..."
                className="input-field resize-none leading-relaxed"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <p className="text-xs text-slate-400 mt-1 text-right">{formData.description.split(/\s+/).filter(Boolean).length} words</p>
            </div>

            {/* Category */}
            <div className="card p-5">
              <label className="block text-sm font-semibold text-slate-700 mb-3">Category <span className="text-red-400">*</span></label>
              <div className="grid grid-cols-3 gap-2">
                {categories.map(cat => (
                  <button key={cat} type="button" onClick={() => setFormData({ ...formData, category: cat })}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all active:scale-95 ${
                      formData.category === cat ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-indigo-300'
                    }`}>
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

          {/* Right - AI Assistant */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <AIAssistant
                title={formData.title}
                description={formData.description}
                onApplyTags={handleApplyTags}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
