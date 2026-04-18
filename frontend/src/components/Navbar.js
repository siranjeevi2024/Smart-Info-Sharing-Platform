import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/trending', label: 'Trending' },
    { to: '/create', label: 'Create' },
    { to: '/messages', label: 'Messages' },
  ];

  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
              <span className="text-base font-black text-white">S</span>
            </div>
            <span className="font-bold text-white text-lg hidden sm:block">Smart <span className="gradient-text">Info</span></span>
          </Link>

          {/* Nav Links */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label }) => (
                <Link key={to} to={to}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(to)
                      ? 'bg-white/15 text-white'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 transition">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-500/50" />
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                      {user.username[0].toUpperCase()}
                    </div>
                  )}
                  <span className="hidden md:block text-sm font-semibold text-slate-200">{user.username}</span>
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 mt-1 w-56 glass-dropdown rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="font-semibold text-white text-sm">{user.username}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    {[
                      { to: '/profile', icon: '👤', label: 'My Profile' },
                      { to: '/saved', icon: '🔖', label: 'Saved Posts' },
                      ...(user.role === 'admin' ? [{ to: '/admin', icon: '⚙️', label: 'Admin Panel' }] : []),
                    ].map(({ to, icon, label }) => (
                      <Link key={to} to={to} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition">
                        <span>{icon}</span> {label}
                      </Link>
                    ))}
                    <hr className="my-1 border-white/10" />
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition w-full text-left">
                      <span>🚪</span> Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">Sign in</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {user && (
        <div className="md:hidden border-t border-white/10 px-4 py-2 flex gap-1 overflow-x-auto">
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                isActive(to) ? 'bg-white/15 text-white' : 'text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
