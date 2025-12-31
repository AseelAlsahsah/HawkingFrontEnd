// src/components/admin/AdminDashboard.tsx
import React, { useState } from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { logout, user } = useAdminAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const stats = [
    { name: 'Total Orders', value: '1,234', change: '+12%', trend: 'up', color: 'text-emerald-600' },
    { name: 'Revenue', value: '$45,678', change: '+28%', trend: 'up', color: 'text-emerald-600' },
    { name: 'Products', value: '567', change: '+3%', trend: 'up', color: 'text-amber-600' },
    { name: 'Customers', value: '890', change: '+15%', trend: 'up', color: 'text-blue-600' },
  ];

  const recentOrders = [
    { id: '#1234', item: 'Gold Necklace 18K', customer: 'Sarah Johnson', amount: '$2,450', status: 'Delivered' },
    { id: '#1235', item: 'Diamond Ring', customer: 'Mike Chen', amount: '$8,900', status: 'Shipped' },
    { id: '#1236', item: 'Gold Bracelet', customer: 'Emma Wilson', amount: '$1,200', status: 'Pending' },
  ];

  const handleLogout = async () => {
    await logout();
    setShowLogoutModal(false);
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      Delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      Shipped: 'bg-blue-100 text-blue-800 border-blue-200',
      Pending: 'bg-amber-100 text-amber-800 border-amber-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Hawking Admin</h1>
                <p className="mt-1 text-sm text-gray-500 font-medium">
                  Welcome back, <span className="text-amber-600 font-semibold">{user?.username}</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="px-6 py-2.5 text-sm font-semibold text-gray-800 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="group bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:shadow-amber-200/50 hover:border-amber-200/50 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide group-hover:text-amber-700 transition-colors">{stat.name}</h3>
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${stat.color === 'text-emerald-600' ? 'from-emerald-400 to-emerald-500' : stat.color === 'text-amber-600' ? 'from-amber-400 to-amber-500' : 'from-blue-400 to-blue-500'} shadow-sm animate-pulse group-hover:animate-none transition-all`}></div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1 group-hover:text-gray-950">{stat.value}</p>
              <p className="text-sm font-semibold flex items-center gap-1.5">
                <span className={`${stat.color} text-lg group-hover:scale-110 transition-transform`}>
                  {stat.trend === 'up' ? '↗️' : '↘️'}
                </span>
                <span className={`${stat.color} font-bold`}>{stat.change}</span>
                <span className="text-gray-500">vs last month</span>
              </p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-amber-50/30">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                    Recent Orders
                  </h2>
                  <Link to="/admin/orders" className="text-sm font-semibold text-amber-600 hover:text-amber-700 group transition-all">
                    View all <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {recentOrders.map((order, index) => (
                  <Link key={index} to={`/admin/orders/${order.id}`} className="block hover:bg-gray-50/50 p-6 hover:shadow-sm transition-all duration-200">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center font-mono text-sm font-bold text-gray-700 flex-shrink-0 shadow-sm">
                        {order.id}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 mb-1 truncate">{order.item}</p>
                        <p className="text-sm text-gray-500 truncate">{order.customer}</p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-2 flex-shrink-0">
                        <p className="text-lg font-bold text-gray-900">{order.amount}</p>
                        <span className={`inline-flex px-3 py-1.5 text-xs font-semibold rounded-full border ${getStatusBadge(order.status)} shadow-sm`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions & System Status */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                    Quick Actions
                </h3>
                <div className="grid grid-cols-1 gap-4">
                    <Link
                    to="/admin/items"
                    className="group block w-full p-5 text-center text-lg font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex items-center justify-center gap-3"
                    >
                    Manage Items
                    </Link>
                    <Link
                      to="/admin/karats"
                      className="group block w-full p-5 text-center text-lg font-bold text-white bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex items-center justify-center gap-3"
                    >
                      Manage Karats
                    </Link>
                    <Link
                      to="/admin/categories"
                      className="group block w-full p-5 text-center text-lg font-bold text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex items-center justify-center gap-3"
                    >
                    Manage Categories
                    </Link>
                    <Link
                      to="/admin/gold-prices"
                      className="group block w-full p-5 text-center text-lg font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex items-center justify-center gap-3"
                    >
                    Manage Gold Prices
                    </Link>
                    <Link
                      to="/admin/reservations"
                      className="group block w-full p-5 text-center text-lg font-bold text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex items-center justify-center gap-3"
                    >
                      Manage Reservations
                    </Link>
                </div>
            </div>

            {/* System Status */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                System Status
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50/50 to-transparent rounded-xl border border-emerald-100">
                  <span className="text-sm font-medium text-gray-700">Backend API</span>
                  <span className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-sm animate-pulse"></div>
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50/50 to-transparent rounded-xl border border-emerald-100">
                  <span className="text-sm font-medium text-gray-700">Database</span>
                  <span className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-sm animate-pulse"></div>
                    Connected
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50/50 to-transparent rounded-xl border border-amber-100">
                  <span className="text-sm font-medium text-gray-700">Payments</span>
                  <span className="flex items-center gap-2 text-sm font-semibold text-amber-700">
                    <div className="w-3 h-3 bg-amber-500 rounded-full shadow-sm animate-pulse"></div>
                    Pending
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-gray-500/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-gray-200">
            <div className="p-8">
              <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-red-100 to-red-200 mb-6 shadow-lg">
                <svg className="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">Log out?</h3>
              <p className="text-lg text-gray-600 mb-8 text-center leading-relaxed">
                Are you sure you want to log out, <span className="font-semibold text-amber-600">{user?.username}</span>?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleLogout}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-6 text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                >
                  Log out
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-900 py-3 px-6 text-sm font-semibold rounded-xl shadow-lg hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
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
