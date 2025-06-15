import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/adminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalUploads: 0,
    mostUsedChart: 'N/A',
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard">
      <h2 className="admin-dashboard-title">Admin Dashboard</h2>

      <div className="admin-cards">
        <div className="admin-card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>

        <div className="admin-card">
          <h3>Total Uploads</h3>
          <p>{stats.totalUploads}</p>
        </div>

        <div className="admin-card">
          <h3>Most Used Chart</h3>
          <p>{stats.mostUsedChart}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
