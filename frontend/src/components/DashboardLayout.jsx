import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/DashboardLayout.css';
import { LogOut } from 'lucide-react';

const BACKEND_URL = 'http://localhost:8000';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 👈 inside component
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const res = await axios.get(`${BACKEND_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
        localStorage.setItem('username', res.data.user.username);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <div className="dashboardlayout-container">
      {/* Decorative Background Elements */}
      <div
        className="background-decorations"
        key={`background-${location.pathname}`} // 👈 key to remount & rerun animation
      >
        <div className="top-right-decoration" />
        <div className="bottom-right-decoration" />
      </div>

      <header className="dashboardlayout-header slide-down">
        <div className="header-left">
          <img src="/images/ZIDIO.webp" alt="Logo" className="dashboardlayout-logo" />
        </div>
        <div className="header-center">Excel Analytics Platform</div>
        <div className="header-right">
          <span className="header-username">
            {user?.username || localStorage.getItem('username') || 'User'}
          </span>
          <img
            src={user?.profileImage ? `${BACKEND_URL}${user.profileImage}` : '/images/avatar.png'}
            alt="Profile"
            className="dashboardlayout-profile-pic"
            onClick={() => navigate('/dashboard/profile')}
          />
        </div>
      </header>

      <div className="dashboardlayout-body">
        <aside className="dashboardlayout-sidebar slide-left">
          <button onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button onClick={() => navigate('/dashboard/upload')}>Upload File</button>
          <button onClick={() => navigate('/dashboard/activity')}>Activity Log</button>
          <button onClick={() => navigate('/dashboard/profile')}>Profile</button>
          <button
            className="logout-button"
            onClick={() => {
              localStorage.clear();
              navigate('/login');
            }}
          >
            <LogOut size={20} />
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
