import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/login';
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';
import Register from './pages/register';
import DashboardLayout from './components/DashboardLayout';

import Dashboard from './pages/dashboard';
import Upload from './pages/upload';
import ActivityLog from './pages/ActivityLog';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import AISuggestion from './pages/AISuggestion';
import RecentCharts from './pages/recentCharts';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Admin Panel */}
          <Route
            path="/adminpanel"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          {/* Protected Dashboard Layout with nested pages */}
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
            <Route path="recentCharts" element={<RecentCharts />} /> {/* ✅ Fixed */}
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
