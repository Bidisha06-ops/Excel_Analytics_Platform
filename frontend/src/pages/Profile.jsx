import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/profile.css';
import { UploadCloud, Save } from 'lucide-react';

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
    setProfileImage(URL.createObjectURL(file));
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
    <div className="profile-wrapper">
      <div className="profile-container">
        <div className="profile-left">
          <div className="avatar-container">
            <img
              src={
                user?.profileImage
                  ? `http://localhost:8000${user.profileImage}`
                  : profileImage || '/images/avatar.png'
              }
              alt="Profile"
              className="profile-avatar"
            />
            <label className="upload-button">
              <UploadCloud size={16} /> Upload
              <input type="file" accept="image/*" onChange={handleImageChange} hidden />
            </label>
          </div>
          <p className="joined-date">Joined: {user ? new Date(user.createdAt).toLocaleDateString() : ''}</p>
        </div>

        <div className="profile-right">
          <h2 className="profile-title">Profile Page</h2>
          {message && <div className={`status-message ${message.includes('Failed') ? 'error' : ''}`}>{message}</div>}

          <div className="form-group">
            <label>Username</label>
            <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="text" value={user?.email} disabled />
          </div>

          <div className="form-group">
            <label>Role</label>
            <input type="text" value={user?.role} disabled />
          </div>

          <button className="update-button" onClick={handleProfileUpdate} disabled={loading}>
            <Save size={16} /> {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;