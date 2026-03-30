import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import ClientDashboard from './pages/ClientDashboard';
import FreelancerDashboard from './pages/FreelancerDashboard';
import Contracts from './pages/Contracts';
import ContractEditor from './pages/ContractEditor';
import ContractDetail from './pages/ContractDetail';

// Protected Route: redirect to /login if not authenticated
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      }}>
        <div style={{
          width: 48,
          height: 48,
          border: '3px solid rgba(255,255,255,0.15)',
          borderTop: '3px solid #7c3aed',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }} />
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

// Public Route: redirect to /dashboard if already logged in
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to={`/${user.role}-dashboard`} replace /> : children;
};

const RoleRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to={`/${user.role}-dashboard`} replace /> : <Navigate to="/login" replace />;
};

const AppRoutes = () => (
  <Routes>
    {/* Default redirect */}
    <Route path="/" element={<RoleRedirect />} />

    {/* Public routes */}
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

    {/* Protected routes */}
    <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
    <Route path="/client-dashboard" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
    <Route path="/freelancer-dashboard" element={<ProtectedRoute><FreelancerDashboard /></ProtectedRoute>} />

    {/* Contract routes */}
    <Route path="/contracts" element={<ProtectedRoute><Contracts /></ProtectedRoute>} />
    <Route path="/contracts/new" element={<ProtectedRoute><ContractEditor /></ProtectedRoute>} />
    <Route path="/contracts/:id" element={<ProtectedRoute><ContractDetail /></ProtectedRoute>} />
    <Route path="/contracts/:id/edit" element={<ProtectedRoute><ContractEditor /></ProtectedRoute>} />

    {/* 404 fallback */}
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
