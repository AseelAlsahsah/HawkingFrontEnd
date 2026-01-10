import React, { useState } from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher';

/* ----------------------------- COLOR MAP ----------------------------- */
const actionColorClasses: Record<
  string,
  { bg: string; text: string }
> = {
  amber: {
    bg: 'bg-amber-100',
    text: 'text-amber-700',
  },
  yellow: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
  },
  indigo: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-700',
  },
  emerald: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
  },
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-700',
  },
  rose: {
    bg: 'bg-rose-100',
    text: 'text-rose-700',
  },
};

const AdminDashboard: React.FC = () => {
  const { logout, user } = useAdminAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { t } = useTranslation();

  const quickActions = [
    { labelKey: 'items', path: '/admin/items', color: 'amber' },
    { labelKey: 'karats', path: '/admin/karats', color: 'indigo' },
    { labelKey: 'categories', path: '/admin/categories', color: 'yellow' },
    { labelKey: 'goldPrices', path: '/admin/gold-prices', color: 'emerald' },
    { labelKey: 'reservations', path: '/admin/reservations', color: 'purple' },
    { labelKey: 'discounts', path: '/admin/discounts', color: 'rose' },
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
            <h1 className="text-3xl font-bold text-gray-900">
              {t('admin.dashboard.title')}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {t('admin.dashboard.welcome')}{' '}
              <span className="font-semibold text-amber-600" dir="ltr">
                {user?.username}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-4">

            <button
              onClick={() => setShowLogoutModal(true)}
              className="px-4 py-2 text-sm font-semibold border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition"
            >
              {t('admin.dashboard.logout')}
            </button>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Section title */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900">
            {t('admin.dashboard.management')}
          </h2>
          <p className="text-sm text-gray-500">
            {t('admin.dashboard.managementSubtitle')}
          </p>
        </div>

        {/* Quick actions grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map(action => {
            const colors = actionColorClasses[action.color];
            const label = t(`admin.dashboard.actions.${action.labelKey}`);

            return (
              <Link
                key={action.path}
                to={action.path}
                className="group bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    {label}
                  </h3>
                  <span
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-lg font-bold ${colors.bg} ${colors.text}`}
                  >
                    →
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {t('admin.dashboard.manage')} {label}
                </p>
              </Link>
            );
          })}
        </div>
      </main>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-gray-200">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('admin.dashboard.confirmLogout')}
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                {t('admin.dashboard.confirmLogoutText')}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleLogout}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold"
                >
                  {t('admin.dashboard.logout')}
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 py-2 rounded-lg font-semibold"
                >
                   {t('common.cancel')}
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
