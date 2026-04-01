import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const AdminDashboard = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const getInitials = (email) => {
    if (!email) return '?';
    return email.charAt(0).toUpperCase();
  };

  return (
    <div className="dashboard-wrapper">
      {/* Background orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      {/* Navbar */}
      <nav className="dash-nav">
        <div className="dash-nav-brand">
          <span className="brand-icon">⚙️</span>
          <span className="brand-name">Admin Control Center</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button id="logout-btn" className="logout-btn" onClick={handleLogout}>
            <span>Sign Out</span>
            <span className="logout-icon">→</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="dash-main">
        {/* Welcome Card */}
        <div className="welcome-card">
          <div className="avatar">
            {getInitials(user?.email)}
          </div>
          <div className="welcome-text">
            <h1 className="welcome-title">Welcome back, Administrator! 👋</h1>
            <p className="welcome-email">{user?.email}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <p className="stat-label">Total Users</p>
              <p className="stat-value">1,204</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💼</div>
            <div className="stat-info">
              <p className="stat-label">System Health</p>
              <p className="stat-value" style={{ color: '#22c55e' }}>Excellent</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">👤</div>
            <div className="stat-info">
              <p className="stat-label">Role</p>
              <p className="stat-value" style={{ color: '#7c3aed', textTransform: 'capitalize' }}>{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="info-banner">
          <div className="info-banner-icon">🛡️</div>
          <div>
            <h3 className="info-banner-title">Security Alert Module</h3>
            <p className="info-banner-text">
              All systems are operating normally. No suspicious activities reported.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
