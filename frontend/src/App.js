import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import Profile from './pages/Profile';
import SavedPosts from './pages/SavedPosts';
import AdminDashboard from './pages/AdminDashboard';
import AuthSuccess from './pages/AuthSuccess';
import Messages from './pages/Messages';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Trending from './pages/Trending';
import UserProfile from './pages/UserProfile';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user && user.role === 'admin' ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <div className="flex-grow">
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/auth/success" element={<AuthSuccess />} />
            
            <Route path="/create" element={
              <PrivateRoute><CreatePost /></PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute><Profile /></PrivateRoute>
            } />
            <Route path="/user/:userId" element={
              <PrivateRoute><UserProfile /></PrivateRoute>
            } />
            <Route path="/saved" element={
              <PrivateRoute><SavedPosts /></PrivateRoute>
            } />
            <Route path="/messages" element={
              <PrivateRoute><Messages /></PrivateRoute>
            } />
            <Route path="/messages/:userId" element={
              <PrivateRoute><Messages /></PrivateRoute>
            } />
            <Route path="/admin" element={
              <AdminRoute><AdminDashboard /></AdminRoute>
            } />
            </Routes>
          </div>
          <Footer />
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;