import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/dashboard.css';

const Dashboard = () => {
  const [uploads, setUploads] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Max uploads goal for circle calculation
  const maxUploadsGoal = 100;

  // Calculate circle progress percentage (cap at 100%)
  const progressPercent = Math.min((uploads.length / maxUploadsGoal) * 100, 100);

  // Circle constants
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  // Function to determine stroke color based on upload percentage
  function getStrokeColor(percent) {
    if (percent >= 75) return '#4CAF50'; // Green
    if (percent >= 50) return '#FFC107'; // Yellow
    if (percent >= 25) return '#FF9800'; // Orange
    return '#F44336'; // Red
  }

  const strokeColor = getStrokeColor(progressPercent);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const uploadsRes = await axios.get('http://localhost:8000/api/records/myuploads', config);
        const activityRes = await axios.get('http://localhost:8000/api/activity/recent', config);
        setUploads(uploadsRes.data);
        setActivityLogs(activityRes.data);
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
      }
    };
    if (token) fetchData();
  }, [token]);

  const handleAnalyze = (id) => {
    navigate(`/dashboard/analytics/${id}`);
  };

  return (
    <div className="dashboard-wrapper">
      <div className="top-columns" style={{ display: 'flex', gap: '20px', flex: 1 }}>
        {/* LEFT COLUMN */}
        <div className="left-column" style={{ display: 'flex', flexDirection: 'column' }}>
          <h2>Dashboard</h2>

          <div
            className="total-uploads-section"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '40px',
            }}
          >
            {/* Total uploads text */}
            <div className="uploads-count" style={{ minWidth: '250px' }}>
              <p style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Total Uploads</p>
              <h1 style={{ fontSize: '40px', fontWeight: '900', margin: 0 }}>{uploads.length}</h1>
            </div>

            {/* Circle outside the total uploads box */}
            <div className="uploads-circle-graph" style={{ width: '120px', height: '120px' }}>
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke="#ddd"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke={strokeColor}
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 1s ease' }}
                />
                <text
                  x="60"
                  y="65"
                  textAnchor="middle"
                  fontSize="22"
                  fill={strokeColor}
                  fontWeight="600"
                >
                  {Math.round(progressPercent)}%
                </text>
              </svg>
            </div>
          </div>

          <div className="quick-actions">
            <h3>Quick Action</h3>
            <div className="buttons-row" style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => navigate('/dashboard/upload')}>Upload New File</button>
              <button onClick={() => navigate('/dashboard/activity')}>View Activity Log</button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="right-column">
          <div className="activity-summary">
            <h3>Activity Summary</h3>
            {activityLogs.length === 0 ? (
              <p>No recent activity.</p>
            ) : (
              <div className="activity-list-scroll">
                <ul>
                  {activityLogs
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                    .map((log, i) => (
                      <li key={i}>
                        {log.action === 'upload' && `Uploaded ${log.filename}`}
                        {log.action === 'analyze' && `Analyzed ${log.filename}`}
                        {log.action === 'export' && `Exported report of ${log.filename}`}
                        {log.action === 'update-profile' && 'Changed username'}
                        {!['upload', 'analyze', 'export', 'update-profile'].includes(log.action) &&
                          `${log.action} performed`}
                        {' '}on {new Date(log.timestamp).toLocaleString()}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM PANEL */}
      <div
        className="bottom-panel"
        style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', width: '100%' }}
      >
        <div className="recent-uploads-container" style={{ flex: 1 }}>
          <h3>Recent Uploads</h3>
          <div className="recent-uploads-scroll">
            <div className="recent-uploads">
              <table>
                <thead>
                  <tr>
                    <th>File Name</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {uploads.map((upload) => (
                    <tr key={upload._id}>
                      <td>{upload.filename}</td>
                      <td>{new Date(upload.uploadedAt).toLocaleDateString()}</td>
                      <td>
                        <button onClick={() => handleAnalyze(upload._id)}>Analyze</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
  