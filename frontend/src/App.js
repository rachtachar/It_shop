import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage'; // สร้าง Component นี้คล้ายๆ LoginPage
import Dashboard from './pages/Dashboard';
import AuthCallback from './pages/AuthCallback';
import AdminManageProduct from './pages/AdminManageProduct';
import { getUserFromToken } from './utils/auth';
import AboutMe from  './pages/AboutMe';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AdminManageUser from './pages/AdminManageUser';

// Component สำหรับป้องกันการเข้าถึงหน้า Dashboard หากยังไม่ได้ Login
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

// AdminRoute สำหรับ Admin เท่านั้น
const AdminRoute = ({ children }) => {
  const user = getUserFromToken();
  // เช็คว่ามี user และ role เป็น admin หรือไม่
  if (user && user.role === 'admin') {
    return children;
  }
  // ถ้าไม่ใช่ ให้เด้งไปหน้า dashboard ปกติ หรือหน้า "Access Denied"
  return <Navigate to="/dashboard" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/cart" element={
          <PrivateRoute>
            <CartPage />
          </PrivateRoute>} 
        />
        <Route path="/dashboard"
          element={
            <PrivateRoute> 
              <Dashboard /> 
            </PrivateRoute>
          }
        />
        <Route path="/aboutme"
          element={
            <PrivateRoute> 
              <AboutMe /> 
            </PrivateRoute>
          }
        />
        <Route path="/product/:id"
          element={
            <PrivateRoute>
              <ProductDetailPage />
            </PrivateRoute>
          }
        />
        <Route path="/admin/product_manage"
          element={
            <AdminRoute>
              <AdminManageProduct />
            </AdminRoute>
          }
        />
        <Route path="/admin/user_manage"
          element={
            <AdminRoute>
              <AdminManageUser />
            </AdminRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;