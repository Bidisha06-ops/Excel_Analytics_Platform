import React, { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Email: ${email}\nPassword: ${password}`);
    // we will connect to API or validation later
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border border-gray-300 rounded-lg shadow-md bg-green-50 font-sans">
      <h2 className="text-center text-4xl  font-bold mb-6 text-green-800">
        Excel Analytics  Login
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
