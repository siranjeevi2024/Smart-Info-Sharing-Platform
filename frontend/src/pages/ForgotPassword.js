import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/forgot-password', { email });
      setMessage(data.message);
      setError('');
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-2xl">🔑</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Reset password</h1>
          <p className="text-slate-500 mt-1">We'll send you a reset link</p>
        </div>

        <div className="card p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">📧</div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Check your email</h3>
              <p className="text-slate-500 text-sm">{message}</p>
              <Link to="/login" className="btn-primary inline-block mt-6">Back to login</Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending...</>
                  ) : 'Send reset link'}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center mt-6 text-sm text-slate-500">
          Remember your password?{' '}
          <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
