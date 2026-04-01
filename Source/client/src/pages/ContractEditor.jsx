import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createContract, getContract, updateContract } from '../api/contracts';
import './Contracts.css';

const TOOLBAR_ACTIONS = [
  { cmd: 'bold', label: 'B', title: 'Bold', style: { fontWeight: '900' } },
  { cmd: 'italic', label: 'I', title: 'Italic', style: { fontStyle: 'italic' } },
  { cmd: 'underline', label: 'U', title: 'Underline', style: { textDecoration: 'underline' } },
  { sep: true },
  { cmd: 'insertUnorderedList', label: '≡', title: 'Bullet list' },
  { cmd: 'insertOrderedList', label: '1.', title: 'Numbered list' },
  { sep: true },
  { cmd: 'justifyLeft', label: '⬛⬜', title: 'Align left' },
  { cmd: 'justifyCenter', label: '⬜⬛', title: 'Align center' },
];

const DEFAULT_CONTENT =
  '<p>This agreement is entered into as of the date signed below by the parties named herein.</p><p><br></p><p><strong>1. SCOPE OF WORK</strong></p><p>Describe the scope of work here...</p><p><br></p><p><strong>2. PAYMENT TERMS</strong></p><p>Describe payment terms and schedule...</p><p><br></p><p><strong>3. TERMINATION</strong></p><p>Either party may terminate this agreement with [X] days written notice...</p><p><br></p><p><strong>4. CONFIDENTIALITY</strong></p><p>Both parties agree to keep all information shared under this agreement confidential...</p>';

const CURRENCY_OPTIONS = ['USD', 'EUR', 'GBP', 'PKR', 'AED', 'INR', 'CAD', 'AUD'];

const ContractEditor = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { token, logoutUser } = useAuth();

  // ── Form state ────────────────────────────────────────────────────────────
  const [title, setTitle] = useState('');
  const [partyAName, setPartyAName] = useState('');
  const [partyARole, setPartyARole] = useState('');
  const [partyBName, setPartyBName] = useState('');
  const [partyBRole, setPartyBRole] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [value, setValue] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [status, setStatus] = useState('draft');
  const [content, setContent] = useState('');
  const [freelancerEmail, setFreelancerEmail] = useState('');
  const [milestones, setMilestones] = useState([]);

  // ── UI state ──────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [saveState, setSaveState] = useState('idle'); // idle | saving | saved
  const [error, setError] = useState('');

  const bodyRef = useRef(null);
  const autoSaveTimer = useRef(null);

  // ── Load contract for editing ─────────────────────────────────────────────
  useEffect(() => {
    if (!isEdit) {
      // Pre-populate with template content
      setContent(DEFAULT_CONTENT);
      return;
    }
    (async () => {
      try {
        const data = await getContract(token, id);
        const c = data.contract;
        setTitle(c.title || '');
        setPartyAName(c.partyA?.name || '');
        setPartyARole(c.partyA?.role || '');
        setPartyBName(c.partyB?.name || '');
        setPartyBRole(c.partyB?.role || '');
        setStartDate(c.startDate ? c.startDate.split('T')[0] : '');
        setEndDate(c.endDate ? c.endDate.split('T')[0] : '');
        setValue(c.value || '');
        setCurrency(c.currency || 'USD');
        setStatus(c.status || 'draft');
        setContent(c.content || DEFAULT_CONTENT);
        setFreelancerEmail(c.freelancerEmail || '');
        setMilestones(c.milestones || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit, token]);

  // ── Sync contentEditable → content state ─────────────────────────────────
  useEffect(() => {
    if (bodyRef.current && content && !bodyRef.current.innerHTML) {
      bodyRef.current.innerHTML = content;
    }
  }, [content]);

  const handleBodyInput = () => {
    if (bodyRef.current) {
      setContent(bodyRef.current.innerHTML);
    }
  };

  // ── Toolbar formatting ────────────────────────────────────────────────────
  const execFormat = (cmd) => {
    bodyRef.current?.focus();
    document.execCommand(cmd, false, null);
  };

  // ── Build payload ─────────────────────────────────────────────────────────
  const buildPayload = useCallback(() => ({
    title: title.trim() || 'Untitled Contract',
    content: bodyRef.current?.innerHTML || content,
    partyA: { name: partyAName, role: partyARole },
    partyB: { name: partyBName, role: partyBRole },
    startDate: startDate || null,
    endDate: endDate || null,
    value: parseFloat(value) || 0,
    currency,
    status,
    freelancerEmail: freelancerEmail.trim(),
    milestones: milestones.map(m => ({
      ...m,
      amount: parseFloat(m.amount) || 0
    })),
  }), [title, content, partyAName, partyARole, partyBName, partyBRole, startDate, endDate, value, currency, status, freelancerEmail, milestones]);

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async (redirect = true) => {
    if (!title.trim()) {
      setError('Please enter a contract title.');
      return;
    }
    try {
      setSaving(true);
      setSaveState('saving');
      setError('');
      const payload = buildPayload();
      if (isEdit) {
        await updateContract(token, id, payload);
      } else {
        const data = await createContract(token, payload);
        if (redirect) {
          navigate(`/contracts/${data.contract._id}`);
          return;
        }
      }
      setSaveState('saved');
      if (redirect) navigate('/contracts');
      setTimeout(() => setSaveState('idle'), 2000);
    } catch (err) {
      setError(err.message);
      setSaveState('idle');
    } finally {
      setSaving(false);
    }
  };

  // ── Auto-save (debounced, edit mode only) ─────────────────────────────────
  useEffect(() => {
    if (!isEdit) return;
    clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      if (title.trim()) {
        setSaveState('saving');
        updateContract(token, id, buildPayload())
          .then(() => { setSaveState('saved'); setTimeout(() => setSaveState('idle'), 2000); })
          .catch(() => setSaveState('idle'));
      }
    }, 2500);
    return () => clearTimeout(autoSaveTimer.current);
  }, [title, partyAName, partyARole, partyBName, partyBRole, startDate, endDate, value, currency, status, content, freelancerEmail, milestones]);

  // ── Milestones Handlers ───────────────────────────────────────────────────
  const addMilestone = () => {
    setMilestones([...milestones, { description: '', amount: '', dueDate: '' }]);
  };

  const removeMilestone = (index) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const updateMilestone = (index, field, val) => {
    const updated = [...milestones];
    updated[index][field] = val;
    setMilestones(updated);
  };

  if (loading) {
    return (
      <div className="contracts-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner-ring" />
      </div>
    );
  }

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
            <Link to="/contracts">Contracts</Link>
            <span>›</span>
            <strong style={{ color: '#c4b5fd' }}>{isEdit ? 'Edit' : 'New Contract'}</strong>
          </div>
        </div>
        <div className="c-nav-right">
          {/* Auto-save indicator */}
          <div className={`save-indicator ${saveState !== 'idle' ? saveState : ''}`}>
            <div className="save-dot" />
            {saveState === 'saving' ? 'Saving…' : saveState === 'saved' ? 'Saved' : ''}
          </div>
          <button className="btn-ghost" onClick={() => navigate('/contracts')}>← Back</button>
          <button
            id="save-contract-btn"
            className="btn-primary"
            onClick={() => handleSave(true)}
            disabled={saving}
          >
            {saving ? '⏳ Saving…' : isEdit ? '💾 Save Changes' : '✨ Create Contract'}
          </button>
          <button
            className="btn-ghost"
            onClick={() => { logoutUser(); navigate('/login'); }}
          >
            Sign Out →
          </button>
        </div>
      </nav>

      <main className="contracts-main">
        <div className="page-header">
          <div>
            <h1 className="page-title">{isEdit ? 'Edit Contract' : 'New Contract'}</h1>
            <p className="page-subtitle">
              {isEdit ? 'Make changes to your contract document' : 'Create a new contract document'}
            </p>
          </div>
        </div>

        {error && <div className="error-banner">⚠️ {error}</div>}

        <div className="editor-layout">
          {/* ── Document Canvas ───────────────────────────────────────── */}
          <div className="doc-canvas">
            {/* Formatting Toolbar */}
            <div className="doc-toolbar">
              {TOOLBAR_ACTIONS.map((a, i) =>
                a.sep ? (
                  <div key={i} className="toolbar-sep" />
                ) : (
                  <button
                    key={a.cmd}
                    id={`fmt-${a.cmd}`}
                    className="toolbar-btn"
                    title={a.title}
                    onMouseDown={(e) => { e.preventDefault(); execFormat(a.cmd); }}
                    style={a.style}
                  >
                    {a.label}
                  </button>
                )
              )}
            </div>

            {/* Document paper */}
            <div className="doc-paper">
              {/* Doc header */}
              <div className="doc-header">
                <div className="doc-type-label">CONTRACT AGREEMENT</div>
                <input
                  id="contract-title-input"
                  className="doc-title-field"
                  placeholder="Contract Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <div className="doc-date-row">
                  <span>Start: {startDate || 'Not set'}</span>
                  <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
                  <span>End: {endDate || 'Not set'}</span>
                  {value && (
                    <>
                      <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
                      <span>
                        Value:{' '}
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value)}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Parties */}
              <div className="doc-parties">
                <div className="party-box">
                  <div className="party-label">Party A</div>
                  <input
                    id="party-a-name"
                    className="party-field"
                    placeholder="Full Name / Company"
                    value={partyAName}
                    onChange={(e) => setPartyAName(e.target.value)}
                  />
                  <input
                    id="party-a-role"
                    className="party-role-field"
                    placeholder="Role (e.g. Client)"
                    value={partyARole}
                    onChange={(e) => setPartyARole(e.target.value)}
                  />
                </div>
                <div className="vs-circle">AND</div>
                <div className="party-box">
                  <div className="party-label">Party B</div>
                  <input
                    id="party-b-name"
                    className="party-field"
                    placeholder="Full Name / Company"
                    value={partyBName}
                    onChange={(e) => setPartyBName(e.target.value)}
                  />
                  <input
                    id="party-b-role"
                    className="party-role-field"
                    placeholder="Role (e.g. Contractor)"
                    value={partyBRole}
                    onChange={(e) => setPartyBRole(e.target.value)}
                  />
                </div>
              </div>

              {/* Milestones section */}
              <div className="doc-section">
                <div className="doc-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Milestones</span>
                  <button className="btn-ghost" style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem' }} onClick={addMilestone}>
                    ＋ Add
                  </button>
                </div>
                {milestones.length === 0 ? (
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>No milestones added.</p>
                ) : (
                  <div className="milestones-editor-list">
                    {milestones.map((m, i) => (
                      <div key={i} className="milestone-editor-row" style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <input
                          className="form-input"
                          placeholder="Description"
                          value={m.description}
                          onChange={(e) => updateMilestone(i, 'description', e.target.value)}
                          style={{ flex: 2, marginBottom: 0 }}
                        />
                        <input
                          type="number"
                          className="form-input"
                          placeholder="Amount"
                          value={m.amount}
                          onChange={(e) => updateMilestone(i, 'amount', e.target.value)}
                          style={{ flex: 1, marginBottom: 0 }}
                        />
                        <input
                          type="date"
                          className="form-input"
                          value={m.dueDate ? m.dueDate.split('T')[0] : ''}
                          onChange={(e) => updateMilestone(i, 'dueDate', e.target.value)}
                          style={{ flex: 1, marginBottom: 0, colorScheme: 'dark' }}
                        />
                        <button className="icon-btn del" onClick={() => removeMilestone(i)} title="Remove">🗑️</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Contract body */}
              <div className="doc-section">
                <div className="doc-section-title">Terms & Conditions</div>
                <div
                  id="contract-body"
                  ref={bodyRef}
                  className="doc-body"
                  contentEditable
                  suppressContentEditableWarning
                  onInput={handleBodyInput}
                  data-placeholder="Write your contract terms, conditions, and clauses here..."
                />
              </div>

              {/* Signature section */}
              <div className="doc-signatures">
                <div className="sig-box">
                  <div className="sig-line" />
                  <div className="sig-label">{partyAName || 'Party A'} — Signature</div>
                </div>
                <div className="sig-box">
                  <div className="sig-line" />
                  <div className="sig-label">{partyBName || 'Party B'} — Signature</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Sidebar ───────────────────────────────────────────────── */}
          <div className="editor-sidebar">
            {/* Contract Details */}
            <div className="sidebar-card">
              <h3>Contract Details</h3>
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input
                  id="start-date"
                  type="date"
                  className="form-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{ colorScheme: 'dark' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input
                  id="end-date"
                  type="date"
                  className="form-input"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{ colorScheme: 'dark' }}
                />
              </div>
              <div className="form-row">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Value</label>
                  <input
                    id="contract-value"
                    type="number"
                    className="form-input"
                    placeholder="0"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Currency</label>
                  <select
                    id="contract-currency"
                    className="form-input"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    style={{ colorScheme: 'dark' }}
                  >
                    {CURRENCY_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '1rem', marginBottom: 0 }}>
                <label className="form-label">Assign Freelancer</label>
                <input
                  id="freelancer-email"
                  type="email"
                  className="form-input"
                  placeholder="freelancer registered email"
                  value={freelancerEmail}
                  onChange={(e) => setFreelancerEmail(e.target.value)}
                />
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.4rem', marginBottom: 0 }}>
                  Enter the email address of the freelancer to send a contract approval request.
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="sidebar-card">
              <h3>Status</h3>
              <div className="status-selector">
                {['draft', 'active'].map((s) => (
                  <div
                    key={s}
                    id={`status-${s}`}
                    className={`status-option sel-${s} ${status === s ? 'selected' : ''}`}
                    onClick={() => setStatus(s)}
                  >
                    {s === 'draft' ? '📝' : '⚡'} {s.charAt(0).toUpperCase() + s.slice(1)}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.75rem', marginBottom: 0 }}>
                {status === 'draft'
                  ? 'Draft contracts are still being edited.'
                  : 'Active contracts are ready for submission.'}
              </p>
            </div>

            {/* Actions */}
            <div className="sidebar-card">
              <h3>Actions</h3>
              <div className="sidebar-actions">
                <button
                  id="save-btn-sidebar"
                  className="btn-primary"
                  onClick={() => handleSave(true)}
                  disabled={saving}
                  style={{ justifyContent: 'center' }}
                >
                  {saving ? '⏳ Saving…' : isEdit ? '💾 Save Changes' : '✨ Create Contract'}
                </button>
                {isEdit && (
                  <button
                    id="view-contract-btn"
                    className="btn-ghost"
                    onClick={() => navigate(`/contracts/${id}`)}
                    style={{ textAlign: 'center' }}
                  >
                    👁 View Contract
                  </button>
                )}
                <button
                  className="btn-ghost"
                  onClick={() => navigate('/contracts')}
                  style={{ textAlign: 'center' }}
                >
                  ← Back to Contracts
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContractEditor;
