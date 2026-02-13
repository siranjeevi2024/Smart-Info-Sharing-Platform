import { useState } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';

export default function Broadcast() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleBroadcast = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/posts/broadcast', { title, message });
      toast.success(`Message sent to ${data.count} users!`);
      setTitle('');
      setMessage('');
    } catch (error) {
      toast.error('Failed to send broadcast');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">📢 Broadcast Message</h2>
      <form onSubmit={handleBroadcast}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border rounded mb-4"
          required
        />
        <textarea
          placeholder="Message to all users..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 border rounded mb-4 h-32"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Send to All Users
        </button>
      </form>
    </div>
  );
}
