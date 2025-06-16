import React from 'react';

import '../styles/adminHeader.css';



  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <img src="/images/ZIDIO.webp" alt="ZIDIO Logo" className="admin-logo" />
        <h1 className="admin-title">Admin Dashboard</h1>
      </div>

      <div className="admin-header-right" onClick={handleProfileClick}>
        <span className="admin-username">{username}</span>
        <img src="/images/avatar.png" alt="Avatar" className="admin-avatar" />
      </div>
    </header>
  );


export default AdminHeader;
