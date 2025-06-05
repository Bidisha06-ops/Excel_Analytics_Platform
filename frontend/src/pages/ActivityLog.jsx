import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/activitylog.css';
import { useNavigate } from 'react-router-dom';

function ActivityLog() {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const navigate = useNavigate();

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8000/api/records/myuploads', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActivities(res.data);
      setFilteredActivities(res.data);
    } catch (error) {
      console.error('Error fetching activity log:', error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleSearch = () => {
    let filtered = activities;

    if (search.trim() !== '') {
      filtered = filtered.filter(item =>
        item.filename.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (dateRange.start && dateRange.end) {
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);

      filtered = filtered.filter(item => {
        const uploadDate = new Date(item.uploadedAt);
        return uploadDate >= start && uploadDate <= end;
      });
    }

    setFilteredActivities(filtered);
  };

  return (
    <div className="activitylog-container">
      <h1>Activity Log</h1>

      <div className="filter-bar">
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
          />
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          />
        </div>
        <div>
          <label>Search Filename:</label>
          <input
            type="text"
            placeholder="milk, orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="activity-table">
        <table>
          <thead>
            <tr>
              <th>Filename</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredActivities.map((item) => (
              <tr key={item._id}>
                <td>{item.filename || 'Untitled.xlsx'}</td>
                <td>{new Date(item.uploadedAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => navigate(`/dashboard/analytics/${item._id}`)}>
                    Analyze
                  </button>
                </td>
              </tr>
            ))}
            {filteredActivities.length === 0 && (
              <tr>
                <td colSpan="3" className="no-results">No activities found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ActivityLog;
