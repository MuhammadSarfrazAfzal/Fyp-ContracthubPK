// API utility functions for auth endpoints
const API_BASE = '/api/auth';

/**
 * Sign up a new user
 * @param {string} email
 * @param {string} password
 * @param {string} role
 * @returns {Promise<{token: string, user: object, message: string}>}
 */
export const signup = async (email, password, role) => {
  const response = await fetch(`${API_BASE}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Signup failed');
  }
  return data;
};

/**
 * Get the currently authenticated user
 * @param {string} token
 * @returns {Promise<{user: object}>}
 */
export const getMe = async (token) => {
  const response = await fetch(`${API_BASE}/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch user');
  }
  return data;
};
