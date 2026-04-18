import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-sm font-black text-white">S</span>
            </div>
            <span className="font-semibold text-slate-700">Smart Info</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
            <Link to="/trending" className="hover:text-indigo-600 transition">Trending</Link>
            <Link to="/create" className="hover:text-indigo-600 transition">Create</Link>
          </div>
          <p className="text-sm text-slate-400">© 2025 Smart Info Sharing Platform</p>
        </div>
      </div>
    </footer>
  );
}
