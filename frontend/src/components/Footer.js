import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-8 mt-auto" style={{ background: 'rgba(15,12,41,0.8)', backdropFilter: 'blur(20px)' }}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
              <span className="text-sm font-black text-white">S</span>
            </div>
            <span className="font-semibold text-white">Smart Info</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <Link to="/" className="hover:text-purple-400 transition">Home</Link>
            <Link to="/trending" className="hover:text-purple-400 transition">Trending</Link>
            <Link to="/create" className="hover:text-purple-400 transition">Create</Link>
          </div>
          <p className="text-sm text-slate-500">© 2025 Smart Info Sharing Platform</p>
        </div>
      </div>
    </footer>
  );
}
