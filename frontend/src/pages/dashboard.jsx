import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/dashboard.css'; // You can style based on this structure

const Dashboard = () => {
  const [uploads, setUploads] = useState([]);
  const [activity, setActivity] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const res = await axios.get('http://localhost:8000/api/records/myuploads', config);
        setUploads(res.data);
        setActivity('You have uploaded several files. Check the list below to analyze them.'); // Mock, later replace with actual activity logs
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, [token]);

  const handleAnalyze = (id) => {
    navigate(`/Dashboard/Analytics/${id}`);
  };

  return (
    <div className="dashboard-container">
      <h1>Welcome to your Dashboard</h1>

      <div className="stats-box">
        <div className="card">Total Uploads: {uploads.length}</div>
      </div>

      <div className="activity-box">
        <h2>Activity Summary</h2>
        <div className="scroll-box">
          <p>{activity}</p>
        </div>
      </div>

      <div className="recent-uploads">
        <h2>Recent Uploads</h2>
        <table>
          <thead>
            <tr>
              <th>Filename</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {uploads.map((upload) => (
              <tr key={upload._id}>
                <td>{upload.filename || 'N/A'}</td>
                <td>{new Date(upload.uploadedAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleAnalyze(upload._id)}>Analyze</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <button onClick={() => navigate('/dashboard/upload')}>Upload New File</button>
        <button onClick={() => navigate('/dashboard/activity')}>View Activity Log</button>
      </div>
    </div>
  );
};

export default Dashboard;
