import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { UserCircle } from 'lucide-react';
import '../styles/ManageRecords.css';

const ManageRecords = () => {
  const [files, setFiles] = useState([]);
  const [groupedUsers, setGroupedUsers] = useState({});
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const modalRef = useRef(null);
  const deleteModalRef = useRef(null);

  // Close modal on outside click
useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      modalRef.current &&
      !modalRef.current.contains(event.target) &&
      !event.target.closest('.btn-danger') // ignore delete button
    ) {
      setShowModal(false);
      setSelectedFileId(null);
    }
  };

  if (showModal) {
    document.addEventListener('mousedown', handleClickOutside);
  }

  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [showModal]);


  // Close delete confirmation modal on outside click
useEffect(() => {
  const handleClickOutsideDelete = (event) => {
    if (
      deleteModalRef.current &&
      !deleteModalRef.current.contains(event.target) &&
      !event.target.closest('.btn-danger')
    ) {
      setShowDeleteModal(false);
      setSelectedFileId(null);
    }
  };

  if (showDeleteModal) {
    document.addEventListener('mousedown', handleClickOutsideDelete);
  }

  return () => {
    document.removeEventListener('mousedown', handleClickOutsideDelete);
  };
}, [showDeleteModal]);


  // Fetch all files from backend
  const fetchFiles = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/records/allfiles');
      setFiles(res.data);
    } catch (error) {
      console.error('Failed to fetch Excel files:', error);
    }
  };

  // Group files by uploader
  const groupFilesByUser = (files) => {
    const grouped = {};
    files.forEach((file) => {
      const uploader = file.uploadedBy;
      if (!uploader || !uploader._id) return;

      if (!grouped[uploader._id]) {
        grouped[uploader._id] = {
          profileImage: uploader.profileImage,
          username: uploader.username || 'Unknown User',
          files: []
        };
      }
      grouped[uploader._id].files.push(file);
    });
    setGroupedUsers(grouped);
  };

  // Handle file delete confirmation
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/records/allfiles/delete/${selectedFileId}`);
      const updatedFiles = files.filter(file => file._id !== selectedFileId);
      setFiles(updatedFiles);
      groupFilesByUser(updatedFiles);

      // If user modal is open, update it
      if (selectedUserData) {
        const updatedUserFiles = selectedUserData.files.filter(file => file._id !== selectedFileId);
        setSelectedUserData({ ...selectedUserData, files: updatedUserFiles });
      }
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setShowDeleteModal(false);
      setSelectedFileId(null);
    }
  };

  const handleDeleteClick = (fileId) => {
    setSelectedFileId(fileId);
    setShowDeleteModal(true);
  };

  const handleUserCardClick = (userId) => {
    const userData = groupedUsers[userId];
    if (userData) {
      setSelectedUserData({ ...userData, userId });
      setShowModal(true);
      setSelectedFileId(null);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    groupFilesByUser(files);
  }, [files]);

  return (
    <div className={`user-management-container ${showModal || showDeleteModal ? 'blurred' : ''}`}>
      <h2 className="heading">Manage Excel File Uploads</h2>

      <div className="user-card-grid">
        {Object.entries(groupedUsers).map(([userId, userData]) => (
          <div className="user-card" key={userId} onClick={() => handleUserCardClick(userId)}>
            {userData.profileImage ? (
              <img
                src={`http://localhost:8000${userData.profileImage}`}
                alt={userData.username}
                className="user-avatar"
              />
            ) : (
              <div className="user-avatar placeholder">
                <UserCircle size={48} color="#aaa" />
              </div>
            )}
            <h4>{userData.username}</h4>
            <p>{userData.files.length} file(s)</p>
          </div>
        ))}
        {files.length === 0 && <p>No Excel files found.</p>}
      </div>

      {/* Modal for user file details */}
      {showModal && selectedUserData && (
        <div className="modal-overlay">
          <div className="modal-box" ref={modalRef}>
            <div className="user-info">
              {selectedUserData.profileImage ? (
                <img
                  src={`http://localhost:8000${selectedUserData.profileImage}`}
                  alt="User"
                  className="user-avatar-large"
                />
              ) : (
                <div className="user-avatar-large placeholder">
                  <UserCircle size={64} color="#aaa" />
                </div>
              )}
              <div className="details">
                <h3>{selectedUserData.username}</h3>
                <span className="userid">User ID: {selectedUserData.userId}</span>
              </div>
            </div>

            <div className="file-list">
              {selectedUserData.files.map((file) => (
                <div key={file._id} className="file-card">
                  <div className="file-info">
                    <h4>{file.filename}</h4>
                    <small>{new Date(file.uploadedAt).toLocaleString()}</small>
                  </div>
                  <div className="file-actions">
                    <button className="btn btn-danger" onClick={() => handleDeleteClick(file._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-box delete-confirm-box" ref={deleteModalRef}>
            <h3>Are you sure you want to delete this file?</h3>
            <div className="modal-actions confirm-delete">
              <button className="btn btn-danger" onClick={handleDeleteConfirm}>Yes, Delete</button>
              <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRecords;
