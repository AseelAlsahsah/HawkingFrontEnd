import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from './contexts/AdminAuthContext';
import LoginForm from './components/admin/LoginForm';
import RegisterForm from './components/admin/RegisterForm'; 

const AdminDashboard = () => {
  const { logout, user } = useAdminAuth();
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Gold Shop Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.username} ({user?.role})</span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
          <p>Your admin panel content goes here...</p>
        </div>
      </div>
    </div>
  );
};

// ProtectedRoute Component
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAdminAuth();
  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  return token ? children : <Navigate to="/admin/login" replace />;
};

// Main App Content with Routes
const AppContent = () => (
  <Router>
    <Routes>
      <Route path="/admin/login" element={<LoginForm />} />
      <Route path="/admin/register" element={<RegisterForm />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
      <Route path="/" element={<Navigate to="/admin/login" replace />} />
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  </Router>
);

function App() {
  return <AdminAuthProvider><AppContent /></AdminAuthProvider>;
}

export default App;
