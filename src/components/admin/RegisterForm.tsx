// src/components/admin/RegisterForm.tsx
import React, { useState, type FormEvent, useEffect } from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useNavigate, Link } from 'react-router-dom';

interface FormData {
  username: string;
  password: string;
  role: string;
}

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ username: '', password: '', role: 'ADMIN' });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { register, token, user, loading: authLoading } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token && user && !authLoading) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [token, user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-12 h-12 mx-auto bg-gray-200 rounded-xl flex items-center justify-center mb-4">
            <div className="w-6 h-6 bg-gray-400 rounded animate-pulse"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Loading...</h2>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await register(formData.username, formData.password, formData.role);
      if (result.success) {
        setSuccess(result.message || 'Admin created successfully!');
        setTimeout(() => navigate('/admin/login', { replace: true }), 1500);
      } else {
        setError(result.message || result.error || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* <div className="mx-auto h-16 w-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg flex items-center justify-center mb-6">
            <span className="text-2xl font-bold text-white">H</span>
          </div> */}
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Admin</h2>
          <p className="text-gray-600">Set up a new admin account</p>
        </div>

        <form className="bg-white py-8 px-6 shadow-sm rounded-xl border border-gray-200 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg text-sm">
              ✓ {success}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="Enter username (min 3 characters)"
                required
                disabled={loading}
                minLength={3}
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="Enter password (min 6 characters)"
                required
                disabled={loading}
                minLength={6}
                autoComplete="new-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-3 px-4 rounded-lg font-semibold text-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              'Create admin account'
            )}
          </button>
        </form>

        <div className="text-center">
          <Link to="/admin/login" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
            ← Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
