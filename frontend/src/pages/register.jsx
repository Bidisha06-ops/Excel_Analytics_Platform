import React, { useState } from 'react';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    alert(
      `Username: ${formData.username}\nEmail: ${formData.email}\nRole: ${formData.role}\nPassword: ${formData.password}`
    );

    // You can later connect this to your API
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border border-gray-300 rounded-lg shadow-md bg-green-50 font-sans">
      <h2 className="text-center text-2xl font-bold mb-6 text-green-800">
        Excel Analytics Platform Register
      </h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username" className="block mb-2 text-green-700 font-medium">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Choose a username"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
        />

        <label htmlFor="email" className="block mb-2 text-green-700 font-medium">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
        />

        <label htmlFor="role" className="block mb-2 text-green-700 font-medium">Role</label>
        <select
          name="role"
          id="role"
          value={formData.role}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
        >
          <option value="">Select Role</option>
          <option value="user">User</option>
          <option value="author">Author</option>
        </select>

        <label htmlFor="password" className="block mb-2 text-green-700 font-medium">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
        />

        <label htmlFor="confirmPassword" className="block mb-2 text-green-700 font-medium">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="w-full p-2 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
        />

        <button
          type="submit"
          className="w-full py-3 bg-green-700 text-white font-semibold rounded hover:bg-green-800 transition-colors"
        >
          Register
        </button>
      </form>
      <p className="text-sm text-center text-green-800 mt-4">
        Already have an account?{' '}
        <a href="/login" className="text-green-900 underline hover:text-green-950">
          Login
        </a>
      </p>
    </div>
  );
}

export default Register;
