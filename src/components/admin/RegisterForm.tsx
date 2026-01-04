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
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    role: 'ADMIN',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto bg-gray-200 rounded-xl animate-pulse mb-4" />
          <p className="text-gray-700 font-semibold">Loading…</p>
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
      const result = await register(
        formData.username,
        formData.password,
        formData.role
      );

      if (result.success) {
        setSuccess(result.message || 'Admin created successfully');
        setTimeout(() => {
          navigate('/admin/login', { replace: true });
        }, 1500);
      } else {
        setError(result.message || result.error || 'Registration failed');
      }
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Create Admin
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Set up a new administrator account
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800 font-semibold">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-5 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800 font-semibold">
              ✓ {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                placeholder="Minimum 3 characters"
                required
                minLength={3}
                disabled={loading}
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                placeholder="Minimum 6 characters"
                required
                minLength={6}
                disabled={loading}
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-bold text-lg transition disabled:opacity-50"
            >
              {loading ? 'Creating…' : 'Create admin'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <Link
            to="/admin/login"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            ← Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
