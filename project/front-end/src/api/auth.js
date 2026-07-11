const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/$/, '');

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();
  return { message: text || 'Request failed' };
}

export async function loginUser(credentials) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  return data;
}

export async function registerUser(payload) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }

  return data;
}

export async function fetchCurrentUser(token) {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.message || 'Failed to load profile');
  }

  return data;
}

export function saveAuthSession(authData) {
  if (authData?.token) {
    localStorage.setItem('campuspost_token', authData.token);
  }

  if (authData?.user) {
    localStorage.setItem('campuspost_user', JSON.stringify(authData.user));
  }
}

export function clearAuthSession() {
  localStorage.removeItem('campuspost_token');
  localStorage.removeItem('campuspost_user');
}
