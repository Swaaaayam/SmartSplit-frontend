import React, { useState } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/register', { name, email, password });
      alert('Registered successfully. Please login.');
      navigate('/login');
    } catch (err) {
      console.error('Register error:', err);
      alert('Registration failed!');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-300 to-blue-200 flex items-center justify-center px-4">
      <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-xl shadow-xl p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700">SmartSplit Register</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-700">Already a user?</p>
        <button
          onClick={handleLogin}
          className="mt-2 w-full border border-indigo-500 text-indigo-600 py-2 rounded-lg hover:bg-indigo-100 transition duration-300"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;
