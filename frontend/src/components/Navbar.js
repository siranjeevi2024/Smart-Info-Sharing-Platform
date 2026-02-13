import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-2xl sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">S</span>
            </div>
            <div className="hidden md:block">
              <h1 className="text-2xl font-bold text-white">Smart Info</h1>
              <p className="text-xs text-indigo-100">Share Knowledge</p>
            </div>
          </Link>

          {/* Center Navigation */}
          {user && (
            <div className="hidden lg:flex items-center gap-2 bg-white/10 backdrop-blur-lg rounded-full px-2 py-2">
              <Link to="/" className="px-6 py-2 text-white hover:bg-white/20 rounded-full transition font-medium">
                Home
              </Link>
              <Link to="/trending" className="px-6 py-2 text-white hover:bg-white/20 rounded-full transition font-medium">
                Trending
              </Link>
              <Link to="/create" className="px-6 py-2 text-white hover:bg-white/20 rounded-full transition font-medium">
                Create
              </Link>
              <Link to="/messages" className="px-6 py-2 text-white hover:bg-white/20 rounded-full transition font-medium">
                Messages
              </Link>
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative group">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-lg px-4 py-2 rounded-full cursor-pointer hover:bg-white/20 transition">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-lg" />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {user.username[0].toUpperCase()}
                    </div>
                  )}
                  <div className="hidden md:block">
                    <p className="text-white font-semibold text-sm">{user.username}</p>
                    <p className="text-indigo-100 text-xs">{user.role}</p>
                  </div>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Hover Dropdown */}
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.username} className="w-12 h-12 rounded-full object-cover border-2 border-white" />
                      ) : (
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-600 font-bold">
                          {user.username[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-white font-bold">{user.username}</p>
                        <p className="text-indigo-100 text-sm">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-gray-700 font-medium">My Profile</span>
                    </Link>
                    <Link to="/saved" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      <span className="text-gray-700 font-medium">Saved Posts</span>
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-gray-700 font-medium">Admin Panel</span>
                      </Link>
                    )}
                    <hr className="my-2" />
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition w-full text-left">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="text-red-600 font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" className="px-6 py-2 text-white hover:bg-white/20 rounded-full transition font-medium">
                  Login
                </Link>
                <Link to="/register" className="px-6 py-2 bg-white text-indigo-600 rounded-full hover:shadow-xl transition font-bold">
                  Sign Up Free
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;