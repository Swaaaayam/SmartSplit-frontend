import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="w-full bg-white/30 text-lg backdrop-blur-md border-b border-white/40 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold text-indigo-700">
          SmartSplit
        </Link>
        <nav className="hidden md:flex space-x-6 text-indigo-600 font-medium">
          <Link to="/dashboard" className="hover:text-indigo-800 transition">Dashboard</Link>
          <Link to="/about" className="hover:text-indigo-800 transition">About Us</Link>
          <Link to="/login" className="hover:text-indigo-800 transition">Login</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
