import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/profile.css';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

function Profile() {
  const [user, setUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8000/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
        setEditName(res.data.user.username || '');
        setProfileImage(null);
        setSelectedFile(null);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Failed to fetch profile.');
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

  const isDirty = () => {
    if (!user) return false;
    return (
      editName.trim() !== (user.username || '').trim() ||
      selectedFile !== null
    );
  };

  const handleProfileUpdate = async () => {
    if (!editName.trim()) {
      toast.error('Username cannot be empty.');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      if (editName !== user.username) {
        await axios.put(
          'http://localhost:8000/api/user/profile/username',
          { username: editName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      if (selectedFile) {
        const formData = new FormData();
        formData.append('profileImage', selectedFile);

        const imgRes = await axios.put(
          'http://localhost:8000/api/user/profile/image',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser((prev) => ({
          ...prev,
          username: editName,
          profileImage: imgRes.data.imagePath,
        }));

        setSelectedFile(null);
        setProfileImage(null);
      } else {
        setUser((prev) => ({ ...prev, username: editName }));
      }

      toast.success('Profile updated successfully.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile.');
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
                profileImage ||
                (user?.profileImage
                  ? `http://localhost:8000${user.profileImage}`
                  : '/images/avatar.png')
              }
              alt="Profile"
              className="profile-avatar"
            />
            <label
              className="upload-icon-button"
              aria-label="Upload profile image"
              tabIndex={0}
            >
              +
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleImageChange}
                hidden
                aria-hidden="true"
              />
            </label>
          </div>
          <p className="joined-date">
            Joined: {user ? new Date(user.createdAt).toLocaleDateString() : ''}
          </p>
        </div>

        <div className="profile-right">
          <h2 className="profile-title">Profile Page</h2>

          <div className="form-group">
            <label htmlFor="username-input">Username</label>
            <input
              id="username-input"
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="text" value={user?.email || ''} disabled />
          </div>

          <div className="form-group">
            <label>Role</label>
            <input type="text" value={user?.role || ''} disabled />
          </div>

          {isDirty() && (
            <button
              className="update-button"
              onClick={handleProfileUpdate}
              disabled={loading}
            >
              <Save size={16} /> {loading ? 'Updating...' : 'Update Profile'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
