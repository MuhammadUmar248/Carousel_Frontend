import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wand2, Home, Info, Mail, Grid3X3 } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl group-hover:from-purple-600 group-hover:to-pink-600 transition-all">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CarouselAI</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`nav-link flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                isActive('/') 
                  ? 'bg-purple-50 text-purple-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="font-medium">Home</span>
            </Link>
            
            <Link
              to="/generator"
              className={`nav-link flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                isActive('/generator') 
                  ? 'bg-purple-50 text-purple-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Wand2 className="w-4 h-4" />
              <span className="font-medium">Generator</span>
            </Link>
            
            <Link
              to="/gallery"
              className={`nav-link flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                isActive('/gallery') 
                  ? 'bg-purple-50 text-purple-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              <span className="font-medium">Gallery</span>
            </Link>
            
            <Link
              to="/about"
              className={`nav-link flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                isActive('/about') 
                  ? 'bg-purple-50 text-purple-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Info className="w-4 h-4" />
              <span className="font-medium">About</span>
            </Link>
            
            <Link
              to="/contact"
              className={`nav-link flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                isActive('/contact') 
                  ? 'bg-purple-50 text-purple-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span className="font-medium">Contact</span>
            </Link>
          </div>

          {/* Mobile menu button (for future implementation) */}
          <div className="md:hidden">
            <button className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
