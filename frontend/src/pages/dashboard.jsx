import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/dashboard.css';

const Dashboard = () => {
  const [uploads, setUploads] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const uploadsRes = await axios.get('http://localhost:8000/api/records/myuploads', config);
        setUploads(uploadsRes.data);

        const activityRes = await axios.get('http://localhost:8000/api/activity/recent', config);
        setActivityLogs(activityRes.data);
      } catch (error) {
        console.error('❌ Error fetching dashboard data:', error);
      }
    };

    if (token) fetchData();
  }, [token]);

  const handleAnalyze = (id) => {
    navigate(`/Dashboard/Analytics/${id}`);
  };

  return (
    <div className="dashboard-container">
      <h1>Welcome to your Dashboard</h1>

      {/* STATS */}
      <div className="stats-box">
        <div className="card">Total Uploads: {uploads.length}</div>
      </div>

      {/* ACTIVITY */}
      <div className="activity-box">
        <h2>Activity Summary</h2>
        <div className="scroll-box">
          {activityLogs.length === 0 ? (
            <p>No recent activity found.</p>
          ) : (
            <ul>
              {activityLogs
                .filter(log => 
                  ['upload', 'analyze', 'export', 'update-profile'].includes(log.action)
                )
                .map((log, index) => (
                  <li key={index}>
                    {log.action === 'upload' && `Uploaded ${log.filename}`}
                    {log.action === 'analyze' && `Analyzed ${log.filename}`}
                    {log.action === 'export' && `Exported report of ${log.filename}`}
                    {log.action === 'update-profile' && `Changed username`}
                    {' '}on {new Date(log.timestamp).toLocaleString()}
                  </li>
              ))}
            </ul>

          )}
        </div>
      </div>

      {/* RECENT UPLOADS */}
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

      {/* QUICK ACTIONS */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <button onClick={() => navigate('/dashboard/upload')}>Upload New File</button>
        <button onClick={() => navigate('/dashboard/activity')}>View Activity Log</button>
      </div>
    </div>
  );
};

export default Dashboard;
