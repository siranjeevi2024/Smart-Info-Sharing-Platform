import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const features = [
  { icon: '📚', title: 'Share Knowledge', desc: 'Create and share posts across multiple categories. Your expertise matters.', color: 'from-blue-500 to-cyan-500' },
  { icon: '🤝', title: 'Build Connections', desc: 'Follow users, engage with content, and grow your professional network.', color: 'from-purple-500 to-pink-500' },
  { icon: '💬', title: 'Real-time Chat', desc: 'Connect instantly with messaging, emojis, and image sharing.', color: 'from-orange-500 to-red-500' },
  { icon: '🔥', title: 'Trending Content', desc: 'Discover what\'s hot and stay ahead with trending posts and topics.', color: 'from-green-500 to-teal-500' },
];

const stats = [
  { value: '10K+', label: 'Active Users', icon: '👥' },
  { value: '50K+', label: 'Posts Shared', icon: '📝' },
  { value: '100K+', label: 'Connections', icon: '🔗' },
  { value: '24/7', label: 'Community', icon: '🌍' },
];

const categories = [
  { name: 'Technology', icon: '💻', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'Science', icon: '🔬', color: 'bg-green-50 text-green-700 border-green-200' },
  { name: 'Business', icon: '📈', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { name: 'Education', icon: '📚', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { name: 'Health', icon: '❤️', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  { name: 'Other', icon: '✨', color: 'bg-slate-50 text-slate-700 border-slate-200' },
];

export default function Landing() {
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState({ users: 0, posts: 0, connections: 0 });

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setCount(prev => ({
          users: Math.min(prev.users + 200, 10000),
          posts: Math.min(prev.posts + 1000, 50000),
          connections: Math.min(prev.connections + 2000, 100000),
        }));
      }, 30);
      setTimeout(() => clearInterval(interval), 1500);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-base font-black text-white">S</span>
            </div>
            <span className="font-bold text-slate-800 text-lg">Smart Info</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-secondary text-sm py-2 px-4">Sign in</Link>
            <Link to="/register" className="btn-primary text-sm py-2 px-4">Get started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 -z-10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse -z-10" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse -z-10" />

        <div className={`container mx-auto max-w-4xl text-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm font-semibold px-4 py-2 rounded-full border border-indigo-200 mb-6">
            🚀 The knowledge sharing platform
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
            Share Knowledge,{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Connect Globally
            </span>
          </h1>
          <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of users sharing insights, building connections, and growing together on the world's most engaging platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-base px-8 py-3.5 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all">
              Get started for free →
            </Link>
            <Link to="/login" className="btn-secondary text-base px-8 py-3.5 hover:-translate-y-0.5 transition-all">
              Sign in to your account
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-slate-900">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, i) => (
              <div key={i} className="group">
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-3xl font-extrabold text-white mb-1">
                  {i === 0 ? `${(count.users / 1000).toFixed(0)}K+` :
                   i === 1 ? `${(count.posts / 1000).toFixed(0)}K+` :
                   i === 2 ? `${(count.connections / 1000).toFixed(0)}K+` : s.value}
                </div>
                <div className="text-slate-400 text-sm font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Everything you need</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">A complete platform for sharing, connecting, and growing your knowledge network.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group card p-7 hover:-translate-y-1 transition-all duration-200 cursor-default">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl mb-5 shadow-sm group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Explore Topics</h2>
          <p className="text-slate-500 mb-10">Discover content across diverse categories</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat, i) => (
              <div key={i} className={`flex items-center gap-2 px-5 py-3 rounded-2xl border-2 font-semibold text-sm cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-200 ${cat.color}`}>
                <span className="text-lg">{cat.icon}</span> {cat.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-indigo-200 text-lg mb-8">Join our community today and start sharing your knowledge with the world.</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-10 py-4 rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all text-lg">
            Create free account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4 text-center text-sm">
        © 2025 Smart Info Sharing Platform. All rights reserved.
      </footer>
    </div>
  );
}
