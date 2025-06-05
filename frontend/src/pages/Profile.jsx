import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState('');

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

  const handleNameChange = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:8000/api/user/profile/username',
        { username: editName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser((prev) => ({ ...prev, username: editName }));
      setMessage('Name updated successfully.');
    } catch (err) {
      console.error(err);
      setMessage('Failed to update name.');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfileImage(URL.createObjectURL(file)); // Preview

    const formData = new FormData();
    formData.append('profileImage', file); // Key must match backend multer field name

    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('http://localhost:8000/api/user/profile/image', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser((prev) => ({ ...prev, profileImage: res.data.imagePath })); // use imagePath from backend
      setMessage('Profile image updated.');
    } catch (err) {
      console.error(err);
      setMessage('Failed to upload image.');
    }
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      {message && <p className="message">{message}</p>}

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
              height="100"
            />
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </div>

          <div className="profile-field">
            <label>Name:</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <button onClick={handleNameChange}>Update Name</button>
          </div>

          <div className="profile-field">
            <label>Email:</label>
            <span>{user.email}</span>
          </div>

          <div className="profile-field">
            <label>Role:</label>
            <span>{user.role}</span>
          </div>

          <div className="profile-field">
            <label>Joined:</label>
            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}

export default Profile;
