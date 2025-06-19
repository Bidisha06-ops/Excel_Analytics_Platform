import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ManageRecords.css'; // Reuse existing styles

const ManageRecords = () => {
  const [files, setFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState(null);

  const fetchFiles = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/records/allfiles');
      setFiles(res.data);
    } catch (error) {
      console.error('Failed to fetch Excel files:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/records/allfiles/delete/${selectedFileId}`);
      setFiles(prev => prev.filter(file => file._id !== selectedFileId));
      setShowModal(false);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleDeleteClick = (fileId) => {
    setSelectedFileId(fileId);
    setShowModal(true);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="user-management-container">
      <h2 className="heading">Excel File Management</h2>
      <div className="table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Filename</th>
              <th>Uploaded By</th>
              <th>Uploaded At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, idx) => (
              <tr key={file._id}>
                <td>{idx + 1}</td>
                <td>{file.filename}</td>
                <td>{file.uploadedBy?.email || 'Unknown'}</td>
                <td>{new Date(file.uploadedAt).toLocaleString()}</td>
                <td>
                  <div className="actions">
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteClick(file._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {files.length === 0 && (
              <tr>
                <td colSpan="5" className="no-users">No Excel files found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

  
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p>Are you sure you want to delete this file? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-danger" onClick={handleDeleteConfirm}>
                Yes, Delete
              </button>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRecords;
