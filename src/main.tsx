import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import App from "./App.tsx"; 
import Collections from "./pages/Collections.tsx";
import ItemDetail from "./pages/ItemDetail.tsx";
import { CartProvider } from './contexts/CartContext';
import CartPage from "./pages/CartPage.tsx";
import { ToastProvider } from './contexts/ToastContext';
import ReservationForm from "./pages/ReservationForm.tsx";
import SearchPage from './pages/SearchPage';
import AboutPage from "./pages/AboutPage";
import GetInTouch from "./pages/GetInTouch.tsx";
import LoginForm from "./components/admin/LoginForm.tsx";
import RegisterForm from "./components/admin/RegisterForm.tsx";
import AdminDashboard from "./components/admin/AdminDashboard.tsx";
import { AdminAuthProvider, useAdminAuth } from "./contexts/AdminAuthContext.tsx";
import ItemsManagement from './components/admin/items/ItemsManagement';
import KaratsManagement from "./components/admin/karats/KaratsManagement.tsx";
import CategoriesManagement from "./components/admin/categories/CategoriesManagement.tsx";
import GoldPricesManagement from "./components/admin/goldPrice/GoldPricesManagement.tsx";
import ReservationsManagement from "./components/admin/reservations/ReservationsManagement.tsx";
import DiscountsManagement from "./components/admin/discounts/DiscountsManagement.tsx";
import AdminProtectedRoute from "./contexts/AdminProtectedRoute.tsx";
 

const AdminRoutes = () => {
  const { token, user, loading } = useAdminAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-900"><div>Loading...</div></div>;
  
  const currentPath = window.location.pathname;
  if (token && user && (currentPath.includes('login') || currentPath.includes('register'))) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <Routes>
    <Route path="login" element={<LoginForm />} />
    <Route path="register" element={<RegisterForm />} />

    <Route element={<AdminProtectedRoute />}>
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="items" element={<ItemsManagement />} />
      <Route path="karats" element={<KaratsManagement />} />
      <Route path="categories" element={<CategoriesManagement />} />
      <Route path="gold-prices" element={<GoldPricesManagement />} />
      <Route path="reservations" element={<ReservationsManagement />} />
      <Route path="discounts" element={<DiscountsManagement />} />
    </Route>

    <Route index element={<Navigate to="login" replace />} />
  </Routes>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <ToastProvider>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<App />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/item/:code" element={<ItemDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/reservation" element={<ReservationForm />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<GetInTouch />} />

            {/* ADMIN ROUTES */}
            <Route 
              path="/admin/*" 
              element={
                <AdminAuthProvider>
                  <AdminRoutes />
                </AdminAuthProvider>
              } 
            />
          </Routes>
        </ToastProvider>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);
