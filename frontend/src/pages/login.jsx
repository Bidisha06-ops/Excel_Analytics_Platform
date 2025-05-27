import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { USER_API_END_POINT } from '../api/api';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${USER_API_END_POINT}/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email, password }), // ✅ Remove credentials
});



      const data = await response.json();

      if (response.ok) {
        toast.success(`Welcome back, ${data.user.username}!`);
        localStorage.setItem('token', data.token);

        if (data.user.role === 'admin') {
          navigate('/adminpanel');
        } else {
          navigate('/dashboard');
        }
      } else {
        toast.error(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border border-gray-300 rounded-lg shadow-md bg-green-50 font-sans">
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="text-center text-4xl font-bold mb-6 text-green-800">
        Excel Analytics Login
      </h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email" className="block mb-3 text-green-700 font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
        />

        <label htmlFor="password" className="block mb-2 text-green-700 font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
        />

        <button
          type="submit"
          className="w-full py-3 bg-green-700 text-white font-semibold rounded hover:bg-green-800 transition-colors"
        >
          Login
        </button>
      </form>

      <p className="text-sm text-center text-green-800 mt-4">
        Don’t have an account?{' '}
        <a href="/register" className="text-green-900 underline hover:text-green-950">
          Register
        </a>
      </p>
    </div>
  );
}

export default Login;
