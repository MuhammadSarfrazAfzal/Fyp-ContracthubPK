import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import NotificationBell from '../components/NotificationBell';
import './Admin.css';
import './Dashboard.css'; // For background orbs

const AdminDashboard = () => {
  const { user, token, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // States for data
  const [users, setUsers] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeContracts: 0,
    pendingDisputes: 0,
    totalVolume: 0
  });
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'client' });
  const [newPass, setNewPass] = useState('');

  const API_BASE = '/api/admin';
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchStats();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'disputes') fetchDisputes();
    
    // "Real-time" polling every 5 seconds for stats and active tab data
    const interval = setInterval(() => {
      fetchStats();
      if (activeTab === 'users') fetchUsers(true);
      if (activeTab === 'disputes') fetchDisputes(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/stats`, { headers });
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching stats', err);
    }
  };

  const fetchUsers = async (isPolling = false) => {
    if (!isPolling) setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/users`, { headers });
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users', err);
    } finally {
      if (!isPolling) setLoading(false);
    }
  };


  const fetchDisputes = async (isPolling = false) => {
    if (!isPolling) setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/disputes`, { headers });
      setDisputes(res.data);
    } catch (err) {
      console.error('Error fetching disputes', err);
    } finally {
      if (!isPolling) setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/users`, newUser, { headers });
      setShowUserModal(false);
      setNewUser({ email: '', password: '', role: 'client' });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating user');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`${API_BASE}/users/${id}`, { headers });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting user');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/users/${selectedUser._id}/reset-password`, { newPassword: newPass }, { headers });
      setShowPasswordModal(false);
      setNewPass('');
      alert('Password reset successfully');
    } catch (err) {
      alert('Error resetting password');
    }
  };

  const handleResolveDispute = async (id, action) => {
    try {
      await axios.post(`${API_BASE}/disputes/${id}/resolve`, { action }, { headers });
      fetchDisputes();
      fetchStats();
    } catch (err) {
      alert('Error resolving dispute');
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  // ─── Sub-Components ─────────────────────────────────────────────────────────

  const Overview = () => (
    <div className="fade-in">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <p className="stat-label">Total Users</p>
            <p className="stat-value">{stats.totalUsers}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📑</div>
          <div className="stat-info">
            <p className="stat-label">Active Contracts</p>
            <p className="stat-value">{stats.activeContracts}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚖️</div>
          <div className="stat-info">
            <p className="stat-label">Open Disputes</p>
            <p className="stat-value" style={{ color: stats.pendingDisputes > 0 ? '#ef4444' : '#fff' }}>
              {stats.pendingDisputes}
            </p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <p className="stat-label">Total Volume</p>
            <p className="stat-value">${stats.totalVolume.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="info-banner" style={{ marginTop: '2rem' }}>
        <div className="info-banner-icon">🚀</div>
        <div>
          <h3 className="info-banner-title">System Overview</h3>
          <p className="info-banner-text">
            All services are operational. You have {stats.pendingDisputes} pending dispute requests that require your attention.
          </p>
        </div>
      </div>
    </div>
  );

  const UserManagement = () => (
    <div className="fade-in">
      <div className="action-bar">
        <button className="primary-btn" onClick={() => setShowUserModal(true)}>
          <span>+</span> Create New User
        </button>
      </div>
      
      <div className="glass-table-container">
        {loading ? <div style={{padding: '2rem', textAlign: 'center'}}>Loading users...</div> : (
          <table className="glass-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge badge-${u.role}`}>{u.role}</span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="icon-btn" title="Reset Password" onClick={() => { setSelectedUser(u); setShowPasswordModal(true); }}>
                        🔑
                      </button>
                      <button className="icon-btn delete" title="Delete User" onClick={() => handleDeleteUser(u._id)}>
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  const DisputeManagement = () => (
    <div className="fade-in">
      {loading ? <div style={{padding: '2rem', textAlign: 'center'}}>Loading disputes...</div> : (
        <div className="dispute-list">
          {disputes.length === 0 ? (
            <div style={{padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)'}}>
              No pending disputes at the moment.
            </div>
          ) : disputes.map(d => (
            <div key={d._id} className="dispute-card">
              <div className="dispute-info">
                <h3>{d.title}</h3>
                <div style={{display: 'flex', gap: '15px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)'}}>
                  <span>Client: {d.user?.email}</span>
                  <span>Freelancer: {d.freelancer?.email}</span>
                  <span>Value: ${d.value}</span>
                </div>
                <div className="dispute-reason">
                  <strong>Reason:</strong> {d.cancellationRequest?.reason}
                  <br />
                  <small style={{display: 'block', marginTop: '4px', opacity: 0.7}}>
                    Requested by: {d.cancellationRequest?.requestedBy?.email} ({d.cancellationRequest?.requestedBy?.role})
                  </small>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="primary-btn" style={{ background: '#22c55e' }} onClick={() => handleResolveDispute(d._id, 'approve')}>
                  Approve Cancel
                </button>
                <button className="primary-btn" style={{ background: '#ef4444' }} onClick={() => handleResolveDispute(d._id, 'reject')}>
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="admin-layout">
      {/* Background orbs from Dashboard.css */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <span style={{fontSize: '1.5rem'}}>💼</span>
          <span>ContracthubPK Admin</span>
        </div>
        
        <nav className="sidebar-nav">
          <div className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <span>📊</span> Overview
          </div>
          <div className={`sidebar-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            <span>👥</span> User Management
          </div>
          <div className={`sidebar-link ${activeTab === 'disputes' ? 'active' : ''}`} onClick={() => setActiveTab('disputes')}>
            <span>⚖️</span> Disputes {stats.pendingDisputes > 0 && <span className="badge badge-cancelled" style={{marginLeft: 'auto', padding: '2px 6px'}}>{stats.pendingDisputes}</span>}
          </div>
          <div className="sidebar-link" onClick={() => navigate('/')}>
             <span>🏠</span> Back to Dashboard
          </div>
        </nav>
        
        <div className="sidebar-footer">
          <div className="sidebar-link" onClick={handleLogout}>
            <span>🚪</span> Sign Out
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        <header className="admin-header">
          <div>
            <h1 className="welcome-title" style={{fontSize: '2rem'}}>
              {activeTab === 'overview' ? 'Command Center' : 
               activeTab === 'users' ? 'Manage Users' : 'Dispute Arbitration'}
            </h1>
            <p className="welcome-email">Logged in as {user?.email}</p>
          </div>
          <NotificationBell />
        </header>

        {activeTab === 'overview' && <Overview />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'disputes' && <DisputeManagement />}
      </main>

      {/* New User Modal */}
      {showUserModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Create User</h2>
            <p className="modal-description">Manually add a new user to the platform.</p>
            <form onSubmit={handleCreateUser}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" required value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Temporary Password</label>
                <input type="password" className="form-input" required value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-input" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                  <option value="client">Client</option>
                  <option value="freelancer">Freelancer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '2rem' }}>
                <button type="submit" className="primary-btn" style={{flex: 1, justifyContent: 'center'}}>Create User</button>
                <button type="button" className="icon-btn" style={{width: 'auto', padding: '0 1.5rem'}} onClick={() => setShowUserModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Reset Password</h2>
            <p className="modal-description">Set a new password for {selectedUser?.email}</p>
            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input type="password" className="form-input" required value={newPass} onChange={e => setNewPass(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '2rem' }}>
                <button type="submit" className="primary-btn" style={{flex: 1, justifyContent: 'center'}}>Update Password</button>
                <button type="button" className="icon-btn" style={{width: 'auto', padding: '0 1.5rem'}} onClick={() => setShowPasswordModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
