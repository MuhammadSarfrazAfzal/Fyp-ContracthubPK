import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const FreelancerDashboard = () => {
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

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
          <span className="brand-icon">💻</span>
          <span className="brand-name">Freelancer Space</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            id="nav-contracts-btn"
            onClick={() => navigate('/contracts')}
            style={{
              background: 'rgba(124,58,237,0.2)',
              border: '1px solid rgba(124,58,237,0.4)',
              color: '#c4b5fd',
              padding: '0.4rem 1rem',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(124,58,237,0.35)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(124,58,237,0.2)'; }}
          >
            📄 Contracts
          </button>
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
            <h1 className="welcome-title">Welcome to your workspace! 👋</h1>
            <p className="welcome-email">{user?.email}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <p className="stat-label">Member Since</p>
              <p className="stat-value">{formatDate(user?.createdAt)}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🧑‍💻</div>
            <div className="stat-info">
              <p className="stat-label">Role</p>
              <p className="stat-value" style={{ color: '#f59e0b', textTransform: 'capitalize' }}>{user?.role}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <p className="stat-label">Active Gigs</p>
              <p className="stat-value">3</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <p className="stat-label">Earned</p>
              <p className="stat-value" style={{ color: '#22c55e' }}>$1,250.00</p>
            </div>
          </div>
        </div>

        {/* Contracts Quick Access Card */}
        <div
          id="go-to-contracts"
          className="info-banner"
          onClick={() => navigate('/contracts')}
          style={{
            cursor: 'pointer',
            background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(99,102,241,0.1) 100%)',
            border: '1px solid rgba(124,58,237,0.35)',
            transition: 'all 0.25s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(124,58,237,0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div className="info-banner-icon">📄</div>
          <div style={{ flex: 1 }}>
            <h3 className="info-banner-title">My Contracts</h3>
            <p className="info-banner-text">
              View offers, sign agreements, and submit your work.
            </p>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
            color: '#fff',
            padding: '0.5rem 1.25rem',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.88rem',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 15px rgba(124,58,237,0.35)',
          }}>
            Open →
          </div>
        </div>

      </main>
    </div>
  );
};

export default FreelancerDashboard;
