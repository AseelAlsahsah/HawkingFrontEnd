import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';

const AdminProtectedRoute = () => {
  const { token, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading…
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
