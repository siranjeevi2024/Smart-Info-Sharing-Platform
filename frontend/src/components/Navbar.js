import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Icons = {
  Home: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Trending: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  News: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    </svg>
  ),
  Cricket: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1V10" />
    </svg>
  ),
  Create: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  Messages: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  Profile: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Saved: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  ),
  Admin: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Logout: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  ChevronDown: () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  ),
};

const navLinks = [
  { to: '/',         label: 'Home',       Icon: Icons.Home,     color: 'text-indigo-600',  bg: 'bg-indigo-50  dark:bg-indigo-900/30' },
  { to: '/trending', label: 'Trending',   Icon: Icons.Trending, color: 'text-rose-600',    bg: 'bg-rose-50    dark:bg-rose-900/30' },
  { to: '/news',     label: 'News',       Icon: Icons.News,     color: 'text-sky-600',     bg: 'bg-sky-50     dark:bg-sky-900/30' },
  { to: '/cricket',  label: 'Cricket',    Icon: Icons.Cricket,  color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
  { to: '/create',   label: 'Create',     Icon: Icons.Create,   color: 'text-violet-600',  bg: 'bg-violet-50  dark:bg-violet-900/30' },
  { to: '/messages', label: 'Messages',   Icon: Icons.Messages, color: 'text-amber-600',   bg: 'bg-amber-50   dark:bg-amber-900/30' },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const drawerRef = useRef(null);
  const userMenuRef = useRef(null);

  const handleLogout = () => { logout(); navigate('/login'); setDrawerOpen(false); };
  const isActive = (path) => location.pathname === path;

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) setDrawerOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [location.pathname]);

  const dropdownLinks = [
    { to: '/profile', Icon: Icons.Profile, label: 'My Profile',  color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/30' },
    { to: '/saved',   Icon: Icons.Saved,   label: 'Saved Posts', color: 'text-amber-600',  bg: 'bg-amber-50  dark:bg-amber-900/30' },
    ...(user?.role === 'admin' ? [{ to: '/admin', Icon: Icons.Admin, label: 'Admin Panel', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/30' }] : []),
  ];

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm dark:bg-slate-900 dark:border-slate-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            <div className="flex items-center gap-3">
              {/* Hamburger */}
              {user && (
                <button
                  onClick={() => setDrawerOpen(o => !o)}
                  className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 transition hover:bg-indigo-50 hover:border-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
                  aria-label="Toggle menu"
                >
                  <span className={`block h-0.5 w-4 rounded-full bg-slate-600 transition-all duration-300 dark:bg-slate-300 ${drawerOpen ? 'translate-y-2 rotate-45' : ''}`} />
                  <span className={`block h-0.5 w-4 rounded-full bg-slate-600 transition-all duration-300 dark:bg-slate-300 ${drawerOpen ? 'opacity-0' : ''}`} />
                  <span className={`block h-0.5 w-4 rounded-full bg-slate-600 transition-all duration-300 dark:bg-slate-300 ${drawerOpen ? '-translate-y-2 -rotate-45' : ''}`} />
                </button>
              )}

              {/* Logo */}
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-all duration-200">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="font-bold text-slate-800 text-lg hidden sm:block dark:text-white">Smart <span className="text-indigo-600">Info</span></span>
              </Link>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Dark/Light toggle */}
              <button
                onClick={toggle}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                aria-label="Toggle theme"
              >
                {dark ? (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(o => !o)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 transition-all duration-150 border border-transparent hover:border-slate-200 dark:hover:bg-slate-800 dark:hover:border-slate-700"
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-100" />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        {user.username[0].toUpperCase()}
                      </div>
                    )}
                    <span className="hidden md:block text-sm font-semibold text-slate-700 dark:text-slate-200">{user.username}</span>
                    <span className={`text-slate-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}>
                      <Icons.ChevronDown />
                    </span>
                  </button>

                  {/* User dropdown */}
                  <div className={`absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden transition-all duration-200 dark:bg-slate-800 dark:border-slate-700 ${
                    userMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'
                  }`}>
                    <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-100 dark:from-indigo-900/30 dark:to-purple-900/30 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {user.username[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-slate-800 text-sm dark:text-slate-100">{user.username}</p>
                          <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-2 px-2">
                      {dropdownLinks.map(({ to, Icon, label, color, bg }) => (
                        <Link key={to} to={to} onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-50 transition-all duration-150 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                          <span className={`w-8 h-8 ${bg} ${color} rounded-lg flex items-center justify-center`}><Icon /></span>
                          <span className="font-medium">{label}</span>
                          <svg className="w-3.5 h-3.5 text-slate-300 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      ))}
                      <hr className="my-2 border-slate-100 dark:border-slate-700" />
                      <button onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-all duration-150 w-full text-left dark:hover:bg-red-900/20"
                      >
                        <span className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center dark:bg-red-900/30"><Icons.Logout /></span>
                        <span className="font-medium">Sign out</span>
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
      </nav>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${drawerOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Left Drawer */}
      <div
        ref={drawerRef}
        className={`fixed left-0 top-0 z-50 h-full w-72 bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:bg-slate-900 ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-bold text-slate-800 text-lg dark:text-white">Smart <span className="text-indigo-600">Info</span></span>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition dark:hover:bg-slate-800"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User info in drawer */}
        {user && (
          <div className="mx-4 mt-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 p-4 dark:from-indigo-900/30 dark:to-purple-900/30">
            <div className="flex items-center gap-3">
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-200" />
              ) : (
                <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-base">
                  {user.username[0].toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100">{user.username}</p>
                <p className="text-xs text-slate-400 truncate max-w-[140px]">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <div className="mt-4 px-3 space-y-1">
          <p className="px-3 pb-1 text-xs font-bold uppercase tracking-widest text-slate-400">Navigation</p>
          {navLinks.map(({ to, label, Icon, color, bg }, i) => (
            <Link
              key={to}
              to={to}
              style={{ transitionDelay: drawerOpen ? `${i * 40}ms` : '0ms' }}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200 ${
                drawerOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
              } ${
                isActive(to)
                  ? `${bg} ${color}`
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${isActive(to) ? bg : 'bg-slate-100 dark:bg-slate-800'} ${isActive(to) ? color : 'text-slate-500 dark:text-slate-400'}`}>
                <Icon />
              </span>
              {label}
              {isActive(to) && (
                <span className="ml-auto h-2 w-2 rounded-full bg-current" />
              )}
            </Link>
          ))}
        </div>

        {/* Bottom actions */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-100 px-3 py-4 dark:border-slate-700 space-y-1">
          <Link to="/profile" onClick={() => setDrawerOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800"><Icons.Profile /></span>
            My Profile
          </Link>
          <button onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition dark:hover:bg-red-900/20"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-900/30"><Icons.Logout /></span>
            Sign out
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
