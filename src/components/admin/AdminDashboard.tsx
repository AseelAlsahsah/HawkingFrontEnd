// src/components/admin/AdminDashboard.tsx
import React, { useState } from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { logout, user } = useAdminAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const quickActions = [
    { label: 'Items', path: '/admin/items', color: 'amber' },
    { label: 'Karats', path: '/admin/karats', color: 'yellow' },
    { label: 'Categories', path: '/admin/categories', color: 'indigo' },
    { label: 'Gold Prices', path: '/admin/gold-prices', color: 'emerald' },
    { label: 'Reservations', path: '/admin/reservations', color: 'purple' },
    { label: 'Discounts', path: '/admin/discounts', color: 'rose' },
  ];

  const handleLogout = async () => {
    await logout();
    setShowLogoutModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Welcome, <span className="font-semibold text-amber-600">{user?.username}</span>
            </p>
          </div>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="px-4 py-2 text-sm font-semibold border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition"
          >
            Log out
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Section title */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900">Management</h2>
          <p className="text-sm text-gray-500">
            Access and manage system resources
          </p>
        </div>

        {/* Quick actions grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map(action => (
            <Link
              key={action.path}
              to={action.path}
              className="group bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {action.label}
                </h3>
                <span
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-${action.color}-100 text-${action.color}-700 font-bold`}
                >
                  →
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Manage {action.label.toLowerCase()} settings and data
              </p>
            </Link>
          ))}
        </div>
      </main>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-gray-200">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Confirm logout
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to log out?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleLogout}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold"
                >
                  Log out
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 py-2 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
