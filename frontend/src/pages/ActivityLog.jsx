// ActivityLog.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/activitylog.css';
import { FileBarChart2, Trash2 } from 'lucide-react';

function ActivityLog() {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(6);
  const navigate = useNavigate();

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Fetch both uploads and activity logs
      const [recordsRes, activityRes] = await Promise.all([
        axios.get('http://localhost:8000/api/records/myuploads', config),
        axios.get('http://localhost:8000/api/activity/recent', config),
      ]);

      const uploads = recordsRes.data;

      // Get all analyzed recordIds
      const analyzedRecordIds = new Set(
        activityRes.data
          .filter(act => act.action === 'analyze' && act.recordId)
          .map(act => act.recordId.toString())
      );

      // Mark uploads as Processed or Pending
      const dataWithStatus = uploads.map(item => ({
        ...item,
        status: analyzedRecordIds.has(item._id.toString()) ? 'Processed' : 'Pending',
      }));

      setActivities(dataWithStatus);
      setFilteredActivities(dataWithStatus);
    } catch (error) {
      console.error('❌ Error fetching activity log:', error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [search, dateRange]);

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
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this file?");
  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("No auth token found. Please login again.");
      return;
    }

    const response = await axios.delete(`http://localhost:8000/api/records/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('Delete response:', response);

    const updatedActivities = activities.filter(item => item._id !== id);
    setActivities(updatedActivities);
    setFilteredActivities(updatedActivities);
  } catch (error) {
    console.error('Error deleting file:', error.response || error.message || error);
    alert("Failed to delete the file. Please try again.");
  }
};


  const startIndex = (currentPage - 1) * resultsPerPage;
  const currentActivities = filteredActivities.slice(startIndex, startIndex + resultsPerPage);
  const totalPages = Math.ceil(filteredActivities.length / resultsPerPage);

  return (
    <div className="activitylog-container">
      <h2>Activity Log</h2>
      <div className="filters">
        <input
          type="text"
          placeholder="Search filename..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="date"
          value={dateRange.start}
          onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
        />
        <input
          type="date"
          value={dateRange.end}
          onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
        />
        <select
          value={resultsPerPage}
          onChange={(e) => setResultsPerPage(parseInt(e.target.value))}
        >
          <option value="3">3</option>
          <option value="6">6</option>
          <option value="9">9</option>
        </select>
      </div>

      <table className="activity-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>File Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentActivities.length > 0 ? (
            currentActivities.map(item => (
              <tr key={item._id}>
                <td>{new Date(item.uploadedAt).toLocaleDateString()}</td>
                <td>{item.filename}</td>
                <td className={item.status === 'Processed' ? 'status-processed' : 'status-pending'}>
                  {item.status}
                </td>
                <td>
                  <button
                    onClick={() => navigate(`/dashboard/analytics/${item._id}`)}
                    className="view-btn"
                  >
                    <FileBarChart2 size={18} color="green" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="delete-btn"
                  >
                    <Trash2 size={18} color="red" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No activities found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination-info">
        Showing {currentActivities.length} of {filteredActivities.length}
      </div>
      <div className="pagination-buttons">
        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
          <button
            key={page}
            className={page === currentPage ? 'active-page' : ''}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ActivityLog;
