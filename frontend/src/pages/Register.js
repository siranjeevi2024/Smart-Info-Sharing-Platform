import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', formData);
      login(data, data.token);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 shadow-lg" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
            <span className="text-2xl font-black text-white">S</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Create account</h1>
          <p className="text-slate-400 mt-1">Join thousands of knowledge sharers</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">Username</label>
              <input
                type="text"
                required
                placeholder="johndoe"
                className="input-field"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">Email address</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="input-field"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">Password</label>
              <input
                type="password"
                required
                minLength="6"
                placeholder="Min. 6 characters"
                className="input-field"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating account...</>
              ) : 'Create account'}
            </button>
          </form>

          <p className="text-xs text-slate-500 text-center mt-4">
            By registering, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>

        <p className="text-center mt-6 text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-400 font-semibold hover:text-purple-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
