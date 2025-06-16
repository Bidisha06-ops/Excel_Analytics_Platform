import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminUserList = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(' http://localhost:8000/api/user/users'); // Update to your API endpoint
      setUsers(res.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
      <div className="overflow-auto rounded shadow-md">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border">#</th>
              <th className="py-2 px-4 border">Profile</th>
              <th className="py-2 px-4 border">Username</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Role</th>
              <th className="py-2 px-4 border">Created</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user._id} className="text-center">
                <td className="py-2 px-4 border">{idx + 1}</td>
                <td className="py-2 px-4 border">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover mx-auto"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm mx-auto">
                      NA
                    </div>
                  )}
                </td>
                <td className="py-2 px-4 border">{user.username}</td>
                <td className="py-2 px-4 border">{user.email}</td>
                <td className="py-2 px-4 border capitalize">{user.role}</td>
                <td className="py-2 px-4 border">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'admin'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="py-2 px-4 border space-x-2">
                  <button className="bg-yellow-500 text-white text-sm px-2 py-1 rounded hover:bg-yellow-600">
                    Edit
                  </button>
                  <button className="bg-red-500 text-white text-sm px-2 py-1 rounded hover:bg-red-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserList;
