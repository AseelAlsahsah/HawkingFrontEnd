import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  username: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, password: string, role: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  logout: () => Promise<void>; 
  isAdmin: boolean;
}

const AdminAuthContext = createContext<AuthState | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return context;
};

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('adminToken'));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();  // ← NEW

  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    const savedUser = localStorage.getItem('adminUser');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('http://localhost:9000/api/v1/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify({
        username: data.username,
        role: data.role
      }));
      
      setToken(data.token);
      setUser({ username: data.username, role: data.role });
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Invalid credentials' };
    }
  };

  const register = async (username: string, password: string, role: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const response = await fetch('http://localhost:9000/api/v1/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await response.json();
      return { success: data.message.includes('successfully'), message: data.message };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Call backend logout API
      if (token) {
        await fetch('http://localhost:9000/api/v1/admin/logout', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }

      // Clear ALL client storage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      sessionStorage.clear();

      // Reset state
      setToken(null);
      setUser(null);

      // Redirect to login
      navigate('/admin/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      // Even if backend fails, still clear client-side
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setToken(null);
      setUser(null);
      navigate('/admin/login', { replace: true });
    }
  };

  const value: AuthState = {
    token,
    user,
    loading,
    login,
    register,
    logout, 
    isAdmin: user?.role === 'ADMIN'
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
