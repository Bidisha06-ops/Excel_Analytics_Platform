import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { USER_API_END_POINT } from '../api/api';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'; // ⬅️ Make sure to import the CSS
import '../styles/font.css'
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
        body: JSON.stringify({ email, password }),
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
    <div className="container">
      <div className="corner top-left" />
      <div className="corner bottom-right" />
      <div className="login-card">
        <Toaster position="top-right" reverseOrder={false} />
        <div className="login-content">
          <h2>Excel Analytics Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="email">Email</label>
            </div>

            <div className="input-group">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="password">Password</label>
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>

          <p className="register-link">
            Don’t have an account? <a href="/register">Register</a>
          </p>
        </div>
      </div>
    </div>

  );
}

export default Login;
