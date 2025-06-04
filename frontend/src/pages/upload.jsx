import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSuccessMessage(''); // clear success message when choosing new file
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post('http://localhost:8000/api/upload', formData, config);

      if (response.data.success || response.data.message) {
        toast.success('Excel file uploaded successfully!');
        setSuccessMessage('Excel file uploaded successfully!');
        setFile(null);
      } else {
        toast.error('Upload failed. Try again.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('An error occurred during upload');
      setSuccessMessage('');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2>Upload Excel File</h2>
      <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="file"
          accept=".xls,.xlsx"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {file && (
        <div style={{ marginTop: '10px' }}>
          <strong>Selected file:</strong> {file.name}
        </div>
      )}

      {successMessage && (
        <div style={{ marginTop: '15px', color: 'green', fontWeight: 'bold' }}>
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default Upload;
