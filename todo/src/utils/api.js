const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
let cleanUrl = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;
if (!cleanUrl.endsWith('/api')) {
  cleanUrl += '/api';
}
const API_BASE_URL = cleanUrl;

export function getAuthToken() {
  return localStorage.getItem('backlogs_access_token') || localStorage.getItem('backlogs_token') || '';
}

export function getRefreshToken() {
  return localStorage.getItem('backlogs_refresh_token') || '';
}

export function setAuthTokens(tokens) {
  if (typeof tokens === 'string') {
    if (tokens) {
      localStorage.setItem('backlogs_access_token', tokens);
      localStorage.setItem('backlogs_token', tokens);
    } else {
      localStorage.removeItem('backlogs_access_token');
      localStorage.removeItem('backlogs_token');
      localStorage.removeItem('backlogs_refresh_token');
    }
    return;
  }

  if (tokens?.accessToken) {
    localStorage.setItem('backlogs_access_token', tokens.accessToken);
    localStorage.setItem('backlogs_token', tokens.accessToken);
  }
  if (tokens?.refreshToken) {
    localStorage.setItem('backlogs_refresh_token', tokens.refreshToken);
  }
}

export function setAuthToken(token) {
  setAuthTokens(token);
}

let isRefreshing = false;

async function request(endpoint, options = {}, isRetry = false) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await res.json();

    // Auto Refresh Token on 401 unauthorized (if refresh token exists and not already retrying)
    if (res.status === 401 && !isRetry && endpoint !== '/auth/login' && endpoint !== '/auth/register' && endpoint !== '/auth/refresh') {
      const refreshTokenStr = getRefreshToken();
      if (refreshTokenStr && !isRefreshing) {
        isRefreshing = true;
        const refreshRes = await request('/auth/refresh', {
          method: 'POST',
          body: JSON.stringify({ refreshToken: refreshTokenStr })
        }, true);

        isRefreshing = false;

        if (refreshRes.success && refreshRes.data) {
          setAuthTokens({
            accessToken: refreshRes.data.accessToken || refreshRes.data.token,
            refreshToken: refreshRes.data.refreshToken
          });
          // Retry original request with fresh access token
          return request(endpoint, options, true);
        } else {
          setAuthTokens('');
        }
      }
    }

    if (!res.ok) {
      return { success: false, message: data.message || 'API request failed', status: res.status };
    }
    return { success: true, data };
  } catch (err) {
    return { success: false, message: 'Server connection failed', isNetworkError: true };
  }
}

export const api = {
  // Auth API
  register: (name, email, password) => request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  refreshToken: (refreshToken) => request('/auth/refresh', { method: 'POST', body: JSON.stringify({ refreshToken }) }),
  getMe: () => request('/auth/me'),

  // Tasks REST API
  getTasks: () => request('/tasks'),
  createTask: (taskData) => request('/tasks', { method: 'POST', body: JSON.stringify(taskData) }),
  updateTask: (id, taskData) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(taskData) }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
  clearCompleted: () => request('/tasks/clear-completed', { method: 'POST' }),

  // User Logs API
  getLogs: () => request('/logs'),
  createLog: (logData) => request('/logs', { method: 'POST', body: JSON.stringify(logData) }),
  deleteLog: (id) => request(`/logs/${id}`, { method: 'DELETE' }),
  clearLogs: () => request('/logs', { method: 'DELETE' })
};


