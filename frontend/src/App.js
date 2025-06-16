import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/login';
import Home from './pages/Home';
import Register from './pages/register';

import DashboardLayout from './components/DashboardLayout';
import AdminDashboardLayout from './components/AdminDashboardLayout';

import Dashboard from './pages/dashboard';
import Upload from './pages/upload';
import ActivityLog from './pages/ActivityLog';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
<<<<<<< HEAD
import AISuggestion from './pages/AISuggestion'; // ✅ Add this line
import AdminUserList from './pages/AdminUserList';
=======
import AISuggestion from './pages/AISuggestion';
import RecentCharts from './pages/recentCharts';

import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import UsageAnalytics from './pages/UsageAnalytics';
import ManageRecords from './pages/ManageRecords';
>>>>>>> c5f57754dda7e6141cb1a83df5833bda02cace0f

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin routes */}
          <Route
<<<<<<< HEAD
            path="/adminpanel"
            element={<ProtectedRoute><AdminPanel /></ProtectedRoute>}
          />
           {/*Users list */}
          <Route
            path="/adminpanel/userlist"
            element={<ProtectedRoute><AdminUserList /></ProtectedRoute>}
          />

=======
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="analytics" element={<UsageAnalytics />} />
            <Route path="records" element={<ManageRecords />} />
          </Route>
>>>>>>> c5f57754dda7e6141cb1a83df5833bda02cace0f

          {/* User dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="upload" element={<Upload />} />
            <Route path="activity" element={<ActivityLog />} />
            <Route path="recentCharts" element={<RecentCharts />} />
            <Route path="profile" element={<Profile />} />
            <Route path="analytics/:id" element={<Analytics />} />
            <Route path="suggestions/:recordId" element={<AISuggestion />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
