import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@/constants';

// Layouts
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

// Auth Pages
import Signup from '@/pages/auth/Signup';
import Login from '@/pages/auth/Login';
import OTP from '@/pages/auth/OTP';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';

// Main App Pages
import Dashboard from '@/pages/Dashboard';
import Products from '@/pages/Products';
import ProductDetails from '@/pages/ProductDetails';
import Orders from '@/pages/Orders';
import Services from '@/pages/Services';
import ServiceDetails from '@/pages/ServiceDetails';
import Profile from '@/pages/Profile';
import Messages from '@/pages/Messages';
import Settings from '@/pages/Settings';
import Transactions from '@/pages/Transactions';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />

        {/* Auth Routes */}
        <Route path={ROUTES.SIGNUP} element={<Signup />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.OTP} element={<OTP />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.PRODUCTS} element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path={ROUTES.ORDERS} element={<Orders />} />
          <Route path={ROUTES.SERVICES} element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetails />} />
          <Route path={ROUTES.PROFILE} element={<Profile />} />
          <Route path={ROUTES.MESSAGES} element={<Messages />} />
          <Route path={ROUTES.SETTINGS} element={<Settings />} />
          <Route path={ROUTES.TRANSACTIONS} element={<Transactions />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
