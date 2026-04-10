const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const AUTH_BASE_URL = `${API_URL}/api/auth`;
const AUTH_STORAGE_KEY = 'resume_auth_session_v1';

const parseJsonResponse = async (response) => {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || payload.details || `Request failed with status ${response.status}`);
  }

  return payload;
};

const request = async (path, options = {}) => {
  const response = await fetch(`${AUTH_BASE_URL}${path}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    body: options.body
  });

  return parseJsonResponse(response);
};

export const registerUser = async ({ fullName, email, phone, password }) =>
  request('/register', {
    method: 'POST',
    body: JSON.stringify({ fullName, email, phone, password })
  });

export const loginUser = async ({ identifier, password }) =>
  request('/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password })
  });

export const loginWithGoogle = async (credential) =>
  request('/google', {
    method: 'POST',
    body: JSON.stringify({ credential })
  });

export const loginWithGitHubCode = async (code) =>
  request('/github', {
    method: 'POST',
    body: JSON.stringify({ code })
  });

export const fetchCurrentUser = async (token) =>
  request('/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

export const saveSession = (session) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
};

export const readSession = () => {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

export const clearSession = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};
