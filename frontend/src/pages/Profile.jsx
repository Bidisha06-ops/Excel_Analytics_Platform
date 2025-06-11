import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/profile.css';
import {
  User,
  Mail,
  BadgeCheck,
  Calendar,
  UploadCloud,
  Save,
} from 'lucide-react';
import { motion } from 'framer-motion'; // ✅ Animation import

function Profile() {
  const [user, setUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8000/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
        setEditName(res.data.user.username);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setProfileImage(URL.createObjectURL(file)); // Preview
  };

  const handleProfileUpdate = async () => {
    setLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');

      await axios.put(
        'http://localhost:8000/api/user/profile/username',
        { username: editName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (selectedFile) {
        const formData = new FormData();
        formData.append('profileImage', selectedFile);

        const imgRes = await axios.put(
          'http://localhost:8000/api/user/profile/image',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUser((prev) => ({
          ...prev,
          username: editName,
          profileImage: imgRes.data.imagePath,
        }));
      } else {
        setUser((prev) => ({ ...prev, username: editName }));
      }

      setMessage('Profile updated successfully.');
    } catch (err) {
      console.error(err);
      setMessage('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="profile-container"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <h2>User Profile</h2>
      {message && (
        <p className={`message ${message.includes('Failed') ? 'error' : ''}`}>
          {message}
        </p>
      )}

      {user ? (
        <div className="profile-card">
          <div className="profile-image">
            <img
              src={
                user.profileImage
                  ? `http://localhost:8000${user.profileImage}`
                  : profileImage || '../images/avatar.png'
              }
              alt="Profile"
            />
            <label className="upload-label">
              <UploadCloud size={16} />
              <span>Upload Image</span>
              <input type="file" accept="image/*" onChange={handleImageChange} hidden />
            </label>
          </div>

          <div className="profile-field">
            <User size={16} />
            <label>Name:</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
          </div>

          <div className="profile-field">
            <Mail size={16} />
            <label>Email:</label>
            <span>{user.email}</span>
          </div>

          <div className="profile-field">
            <BadgeCheck size={16} />
            <label>Role:</label>
            <span>{user.role}</span>
          </div>

          <div className="profile-field">
            <Calendar size={16} />
            <label>Joined:</label>
            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>

          <button
            className="update-button"
            onClick={handleProfileUpdate}
            disabled={loading}
          >
            <Save size={16} style={{ marginRight: '5px' }} />
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </motion.div>
  );
}

export default Profile;
