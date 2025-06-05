// src/components/DashboardLayout.jsx
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/DashboardLayout.css';

const BACKEND_URL = 'http://localhost:8000';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login'); // redirect if no token
          return;
        }
        const res = await axios.get(`${BACKEND_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
        // Optionally save username in localStorage to keep old code compatible
        localStorage.setItem('username', res.data.user.username);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        navigate('/login'); // redirect on error or unauthorized
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <div className="dashboardlayout-container">
      <header className="dashboardlayout-header">
        <img src="/images/ZIDIO.webp" alt="Logo" className="dashboardlayout-logo" />
        <h2>Welcome, {user?.username || localStorage.getItem('username') || 'User'}</h2>
        <img
          src={
            user?.profileImage
              ? `${BACKEND_URL}${user.profileImage}`
              : '/images/avatar.png'
          }
          alt="Profile"
          className="dashboardlayout-profile-pic"
          onClick={() => navigate('/dashboard/profile')}
        />
      </header>

      <div className="dashboardlayout-body">
        <aside className="dashboardlayout-sidebar">
          <button onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button onClick={() => navigate('/dashboard/upload')}>Upload File</button>
          <button onClick={() => navigate('/dashboard/activity')}>Activity Log</button>
          <button onClick={() => navigate('/dashboard/profile')}>Profile</button>
          <button
            onClick={() => {
              localStorage.clear();
              navigate('/login');
            }}
          >
            Logout
          </button>
        </aside>

        <main className="dashboardlayout-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
