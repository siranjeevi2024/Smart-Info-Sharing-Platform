import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Share Knowledge, Connect Globally
          </h1>
          <p className="text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join thousands of users sharing insights, building connections, and growing together on the world's most engaging platform
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-lg font-bold hover:shadow-2xl transition transform hover:scale-105">
              Get Started Free
            </Link>
            <Link to="/login" className="px-8 py-4 bg-white text-blue-600 rounded-full text-lg font-bold hover:shadow-xl transition border-2 border-blue-600">
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-2xl font-bold mb-3">Share Knowledge</h3>
            <p className="text-gray-600">Create and share posts across multiple categories. Your expertise matters.</p>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition">
            <div className="text-5xl mb-4">🤝</div>
            <h3 className="text-2xl font-bold mb-3">Build Connections</h3>
            <p className="text-gray-600">Follow users, engage with content, and grow your professional network.</p>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition">
            <div className="text-5xl mb-4">💬</div>
            <h3 className="text-2xl font-bold mb-3">Real-time Chat</h3>
            <p className="text-gray-600">Connect instantly with messaging, emojis, and image sharing.</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white mb-20">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">Active Users</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">50K+</div>
              <div className="text-blue-100">Posts Shared</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">100K+</div>
              <div className="text-blue-100">Connections Made</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Community Support</div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Explore Topics</h2>
          <p className="text-gray-600 mb-8">Discover content across diverse categories</p>
          <div className="flex flex-wrap gap-4 justify-center">
            {['Technology', 'Science', 'Business', 'Education', 'Health', 'Other'].map(cat => (
              <div key={cat} className="bg-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition cursor-pointer">
                <span className="font-semibold text-gray-800">{cat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-3xl p-12 text-center shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">Join our community today and start sharing your knowledge</p>
          <Link to="/register" className="inline-block px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-xl font-bold hover:shadow-2xl transition transform hover:scale-105">
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
}
