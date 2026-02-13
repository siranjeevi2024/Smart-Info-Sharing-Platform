import { useState } from 'react';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5002/api/auth/forgot-password', { email });
      setMessage(data.message);
      setError('');  
    } catch (err) {
      console.error('Error:', err.response?.data);
      setError(err.response?.data?.error || 'Something went wrong');
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Forgot Password</h2>
        {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{message}</div>}
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded mb-4"
            required
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}
