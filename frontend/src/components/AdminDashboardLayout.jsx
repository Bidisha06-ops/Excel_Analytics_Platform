import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BarChart2,
  Folder,
  LogOut,
} from 'lucide-react';
import '../styles/DashboardLayout.css';

const AdminDashboardLayout = () => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboardlayout-container">
      {/* Decorative corners */}
      <div className="background-decorations">
        <div className="top-right-decoration" />
        <div className="bottom-right-decoration" />
      </div>

      {/* Header */}
      <header className="dashboardlayout-header slide-down">
        <div className="header-left">
          <img
            src="/images/ZIDIO.webp"
            alt="Admin Logo"
            className="dashboardlayout-logo"
          />
        </div>
        <div className="header-center">Excel Analytics Platform</div>
        <div className="header-right">
          <img
            src="/images/avatar.png"
            alt="Admin Avatar"
            className="dashboardlayout-profile-pic"
          />
        </div>
      </header>

      {/* Sidebar + Content */}
      <div className="dashboardlayout-body">
        <aside className="dashboardlayout-sidebar slide-left">
          <button onClick={() => navigate('/admin')}>
            <LayoutDashboard size={18} />
            Dashboard
          </button>
          <button onClick={() => navigate('/admin/users')}>
            <Users size={18} />
            Manage User
          </button>
          <button onClick={() => navigate('/admin/analytics')}>
            <BarChart2 size={18} />
            Usage Analytics
          </button>
          <button onClick={() => navigate('/admin/records')}>
            <Folder size={18} />
            Manage Records
          </button>
          <button onClick={logoutHandler} className="logout-button">
            <LogOut size={18} />
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

export default AdminDashboardLayout;
