import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-white/30 backdrop-blur-md border-t border-white/40 text-center py-6 mt-5 text-md text-indigo-800">
      <div className="max-w-4xl mx-auto px-4">
        <p>&copy; {new Date().getFullYear()} <span className="font-semibold">SmartSplit</span>. All rights reserved.</p>
        <p className="mt-1">
          Built with 💙 by <span className="font-semibold">Swayamprajna Sahoo</span>
        </p>
        <div className="mt-2 space-x-4 text-indigo-600">
          <a href="/about" className="hover:underline">About Us</a>
          <a href="/dashboard" className="hover:underline">Dashboard</a>
          <a href="/login" className="hover:underline">Login</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
