import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import moment from 'moment'; // ✅ Install moment if not already: npm install moment
import '../styles/adminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalUploads: 0,
    mostUsedChart: 'N/A',
    chartData: [],
  });

  const [viewType, setViewType] = useState('day'); // day | week | month

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

  const groupChartData = (data, type) => {
    const grouped = {};

    data.forEach(item => {
      let key;
      if (type === 'week') {
        key = moment(item.date).startOf('isoWeek').format('YYYY-[W]WW');
      } else if (type === 'month') {
        key = moment(item.date).format('YYYY-MM');
      } else {
        key = item.date;
      }

      if (!grouped[key]) {
        grouped[key] = { date: key, uploads: 0, analyzed: 0 };
      }
      grouped[key].uploads += item.uploads || 0;
      grouped[key].analyzed += item.analyzed || 0;
    });

    return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const filteredData = groupChartData(stats.chartData, viewType);

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

      <div className="admin-chart-section">
        <div className="admin-chart-header">
          <h3 className="admin-chart-title"><b>Uploads vs Analyzed Files</b></h3>
          <div className="view-toggle">
            <button
              className={viewType === 'day' ? 'active' : ''}
              onClick={() => setViewType('day')}
            >
              Day
            </button>
            <button
              className={viewType === 'week' ? 'active' : ''}
              onClick={() => setViewType('week')}
            >
              Week
            </button>
            <button
              className={viewType === 'month' ? 'active' : ''}
              onClick={() => setViewType('month')}
            >
              Month
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={filteredData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
  dataKey="date"
  tickFormatter={(date) => {
    if (viewType === 'day') {
      return moment(date).format('MMM D'); // Jun 18
    } else if (viewType === 'week') {
      const start = moment(date, 'YYYY-[W]WW').startOf('isoWeek');
      const end = moment(date, 'YYYY-[W]WW').endOf('isoWeek');
      return `${start.format('MMM D')} - ${end.format('MMM D')}`; // e.g., Jun 17 - Jun 23
    } else if (viewType === 'month') {
      return moment(date).format('MMMM'); // June
    }
    return date;
  }}
/>

            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="uploads"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 5 }}
              name="Uploads"
            />
            <Line
              type="monotone"
              dataKey="analyzed"
              stroke="#82ca9d"
              strokeWidth={2}
              dot={{ r: 5 }}
              name="Analyzed"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
