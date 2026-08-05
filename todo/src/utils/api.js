const API_BASE_URL = 'http://localhost:5000/api';

export function getAuthToken() {
  return localStorage.getItem('backlogs_token') || '';
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('backlogs_token', token);
  } else {
    localStorage.removeItem('backlogs_token');
  }
}

async function request(endpoint, options = {}) {
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
  getMe: () => request('/auth/me'),

  // Tasks REST API
  getTasks: () => request('/tasks'),
  createTask: (taskData) => request('/tasks', { method: 'POST', body: JSON.stringify(taskData) }),
  updateTask: (id, taskData) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(taskData) }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
  clearCompleted: () => request('/tasks/clear-completed', { method: 'POST' })
};
