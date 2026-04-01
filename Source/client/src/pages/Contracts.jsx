import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getContracts, deleteContract } from '../api/contracts';
import './Contracts.css';

const STATUS_TABS = ['all', 'draft', 'pending_approval', 'active', 'submitted', 'completed', 'rejected'];

const statusIcon = (s) => ({ draft: '📝', pending_approval: '⏳', active: '⚡', submitted: '✅', completed: '🏆', rejected: '❌' }[s] || '📄');

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

const formatValue = (v, cur = 'USD') =>
  v ? new Intl.NumberFormat('en-US', { style: 'currency', currency: cur, maximumFractionDigits: 0 }).format(v) : '—';

// ── Confirm Delete Modal ──────────────────────────────────────────────────────
const ConfirmModal = ({ title, onConfirm, onCancel }) => (
  <div className="modal-overlay">
    <div className="modal-box">
      <div className="modal-icon">🗑️</div>
      <h3>Delete Contract?</h3>
      <p>
        Are you sure you want to delete <strong style={{ color: '#fff' }}>"{title}"</strong>? This
        action cannot be undone.
      </p>
      <div className="modal-actions">
        <button className="btn-ghost" onClick={onCancel}>Cancel</button>
        <button className="btn-danger" onClick={onConfirm}>Delete</button>
      </div>
    </div>
  </div>
);

// ── Contract Card ─────────────────────────────────────────────────────────────
const ContractCard = ({ contract, onDelete, onClick }) => (
  <div className="contract-card" onClick={() => onClick(contract._id)}>
    <div className="card-header">
      <h3 className="card-title">{contract.title}</h3>
      <div className="card-icon">{statusIcon(contract.status)}</div>
    </div>

    {(contract.partyA?.name || contract.partyB?.name) && (
      <div className="card-parties">
        {contract.partyA?.name && <span className="party-name">{contract.partyA.name}</span>}
        {contract.partyA?.name && contract.partyB?.name && (
          <span className="party-sep">↔</span>
        )}
        {contract.partyB?.name && <span className="party-name">{contract.partyB.name}</span>}
      </div>
    )}

    <div className="card-meta">
      <span className="card-value">{formatValue(contract.value, contract.currency)}</span>
      <span className="card-date">📅 {formatDate(contract.startDate)}</span>
    </div>

    <div className="card-footer">
      <span className={`status-badge ${contract.status}`}>
        <span>{statusIcon(contract.status)}</span>
        {contract.status}
      </span>
      <div className="card-actions" onClick={(e) => e.stopPropagation()}>
        <button
          id={`edit-${contract._id}`}
          className="icon-btn"
          title="Edit"
          onClick={() => onClick(contract._id, 'edit')}
        >
          ✏️
        </button>
        <button
          id={`delete-${contract._id}`}
          className="icon-btn del"
          title="Delete"
          onClick={() => onDelete(contract)}
        >
          🗑️
        </button>
      </div>
    </div>
  </div>
);

// ── Main Contracts Page ───────────────────────────────────────────────────────
const Contracts = () => {
  const { token, user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQ, setSearchQ] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchContracts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getContracts(token, { status: statusFilter, q: searchQ });
      setContracts(data.contracts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, statusFilter, searchQ]);

  useEffect(() => {
    const timer = setTimeout(fetchContracts, 300);
    return () => clearTimeout(timer);
  }, [fetchContracts]);

  const handleCardClick = (id, mode = 'view') => {
    navigate(mode === 'edit' ? `/contracts/${id}/edit` : `/contracts/${id}`);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteContract(token, deleteTarget._id);
      setContracts((prev) => prev.filter((c) => c._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const countsByStatus = contracts.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="contracts-wrapper">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Navbar */}
      <nav className="c-nav">
        <div className="c-nav-left">
          <div className="c-nav-brand">
            <span className="brand-icon">🔐</span>
            <span>MyApp</span>
          </div>
          <div className="c-nav-breadcrumb">
            <span>›</span>
            <Link to="/dashboard">Dashboard</Link>
            <span>›</span>
            <strong style={{ color: '#c4b5fd' }}>Contracts</strong>
          </div>
        </div>
        <div className="c-nav-right">
          {user?.role !== 'freelancer' && (
            <button id="new-contract-btn" className="btn-primary" onClick={() => navigate('/contracts/new')}>
              ＋ New Contract
            </button>
          )}
          <button
            className="btn-ghost"
            onClick={() => { logoutUser(); navigate('/login'); }}
          >
            Sign Out →
          </button>
        </div>
      </nav>

      <main className="contracts-main">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Contracts</h1>
            <p className="page-subtitle">
              {contracts.length} contract{contracts.length !== 1 ? 's' : ''} total
            </p>
          </div>
        </div>

        {error && (
          <div className="error-banner">
            ⚠️ {error}
          </div>
        )}

        {/* Filter Bar */}
        <div className="filter-bar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              id="contract-search"
              type="text"
              className="search-input"
              placeholder="Search contracts..."
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
            />
          </div>
          <div className="filter-tabs">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab}
                id={`tab-${tab}`}
                className={`filter-tab ${statusFilter === tab ? 'active' : ''}`}
                onClick={() => setStatusFilter(tab)}
              >
                {tab === 'all'
                  ? `All (${contracts.length})`
                  : `${tab.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())} (${countsByStatus[tab] || 0})`}
              </button>
            ))}
          </div>
        </div>

        {/* Contract Grid */}
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner-ring" />
          </div>
        ) : contracts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            <h3>No contracts yet</h3>
            <p>Create your first contract to get started.</p>
            {user?.role !== 'freelancer' && (
              <button className="btn-primary" onClick={() => navigate('/contracts/new')}>
                ＋ Create Contract
              </button>
            )}
          </div>
        ) : (
          <div className="contracts-grid">
            {contracts.map((c) => (
              <ContractCard
                key={c._id}
                contract={c}
                onClick={handleCardClick}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <ConfirmModal
          title={deleteTarget.title}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default Contracts;
