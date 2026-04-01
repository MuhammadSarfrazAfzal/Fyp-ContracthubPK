const API_URL = '/api/contracts';

const authHeader = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

// Get all contracts (with optional filters)
export const getContracts = async (token, { status = 'all', q = '' } = {}) => {
  const params = new URLSearchParams();
  if (status && status !== 'all') params.append('status', status);
  if (q) params.append('q', q);
  const res = await fetch(`${API_URL}?${params}`, { headers: authHeader(token) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch contracts');
  return data;
};

// Get single contract
export const getContract = async (token, id) => {
  const res = await fetch(`${API_URL}/${id}`, { headers: authHeader(token) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Contract not found');
  return data;
};

// Create contract
export const createContract = async (token, payload) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: authHeader(token),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create contract');
  return data;
};

// Update contract
export const updateContract = async (token, id, payload) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: authHeader(token),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update contract');
  return data;
};

// Submit contract with optional file
export const submitContract = async (token, id, file) => {
  const formData = new FormData();
  if (file) formData.append('workFile', file);

  const res = await fetch(`${API_URL}/${id}/submit`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to submit contract');
  return data;
};

// Delete contract
export const deleteContract = async (token, id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: authHeader(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete contract');
  return data;
};

// Request approval
export const requestApproval = async (token, id) => {
  const res = await fetch(`${API_URL}/${id}/request-approval`, {
    method: 'POST',
    headers: authHeader(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to request approval');
  return data;
};

// Respond to contract (approve/reject)
export const respondToContract = async (token, id, action) => {
  const res = await fetch(`${API_URL}/${id}/respond`, {
    method: 'POST',
    headers: authHeader(token),
    body: JSON.stringify({ action }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to respond to contract');
  return data;
};

// Approve overall contract work (Client)
export const approveContractWork = async (token, id) => {
  const res = await fetch(`${API_URL}/${id}/approve-work`, {
    method: 'POST',
    headers: authHeader(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to approve contract work');
  return data;
};

// Submit custom file for a milestone (Freelancer)
export const submitMilestoneWork = async (token, id, milestoneId, file) => {
  const formData = new FormData();
  if (file) formData.append('workFile', file);

  const res = await fetch(`${API_URL}/${id}/milestones/${milestoneId}/submit`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to submit milestone work');
  return data;
};

// Approve milestone (Client)
export const approveMilestone = async (token, id, milestoneId) => {
  const res = await fetch(`${API_URL}/${id}/milestones/${milestoneId}/approve`, {
    method: 'POST',
    headers: authHeader(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to approve milestone');
  return data;
};

