import React, { useState } from 'react';
function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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
    alert(`Name: ${formData.name}\nEmail: ${formData.email}\nPassword: ${formData.password}`);
    // You can later connect this to your API
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border border-gray-300 rounded-lg shadow-md bg-green-50 font-sans">
      <h2 className="text-center text-2xl font-bold mb-6 text-green-800">
        Excel Analytics Platform Register
      </h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name" className="block mb-2 text-green-700 font-medium">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Enter your name"
          value={formData.name}
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
