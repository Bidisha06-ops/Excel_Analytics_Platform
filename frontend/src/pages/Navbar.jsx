import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-[#217346] text-white px-6 py-3 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold tracking-wide">
          Excel Analytics
        </Link>
        <div className="space-x-4">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/login" className="hover:underline">
            Login
          </Link>
          <Link to="/register" className="hover:underline">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
