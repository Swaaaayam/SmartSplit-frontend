import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-300 to-blue-200 px-6 py-12 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white/50 backdrop-blur-md border border-white/30 shadow-xl rounded-3xl p-8 md:p-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-6">About SmartSplit</h1>
        <p className="text-lg md:text-xl text-gray-800 leading-relaxed mb-6">
          <strong>SmartSplit</strong> is your intelligent expense-sharing app, designed to simplify the way you manage group finances. Whether you're sharing rent with roommates, planning a trip with friends, or splitting bills with colleagues — SmartSplit ensures everyone pays their fair share.
        </p>
        <p className="text-base md:text-lg text-gray-700 mb-4">
          Track expenses, split costs equally or unequally, and settle balances with ease. SmartSplit supports custom splits, real-time balance tracking, and group management features that make financial coordination stress-free.
        </p>
        <p className="text-base md:text-lg text-gray-700 mb-6">
          Built with ❤️ using <span className="font-medium">MERN Stack</span> (MongoDB, Express, React, Node.js), SmartSplit is fast, reliable, and ready to help you keep your finances transparent and fair.
        </p>

        <h2 className="text-2xl font-bold text-indigo-600 mt-8 mb-4">Meet the Developer</h2>
        <p className="text-base md:text-lg text-gray-800">
          Hi, I'm <strong>Swayamprajna Sahoo</strong>, a passionate software engineer who loves solving real-world problems with code. I created SmartSplit to make group expenses effortless, transparent, and fair for everyone.
        </p>

        <div className="mt-8 flex justify-center gap-6 text-indigo-700">
          <a href="https://github.com/Swayamprajna" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-indigo-900">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/swayamprajna/" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-indigo-900">
            LinkedIn
          </a>
          <a href="mailto:swayamprajna24work@gmail.com" className="hover:underline hover:text-indigo-900">
            Contact
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
