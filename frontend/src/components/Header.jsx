import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/header.css';

const Header = () => (
  <div>
    <img src="/images/bg.png" alt="Logo" style={{ width: 100, height: 'auto' }} />
    <img src="/images/avatar.png" alt="Avatar" style={{ width: 100, height: 'auto' }} />
  </div>
);



export default Header;
