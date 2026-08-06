import { api, setAuthToken, getAuthToken } from './api';
import { loadStoredData, saveStoredData } from './storage';

const USERS_KEY = 'backlogs_users';
const CURRENT_USER_KEY = 'backlogs_current_user';

export function getRegisteredUsers() {
  return loadStoredData(USERS_KEY, [
    {
      id: 'demo-user-1',
      name: 'Demo User',
      email: 'demo@backlogs.app',
      passwordHash: 'demo123'
    }
  ]);
}

export function getCurrentUser() {
  return loadStoredData(CURRENT_USER_KEY, null);
}

export async function loginUser(email, password) {
  // Try Backend MongoDB first
  const apiRes = await api.login(email, password);
  if (apiRes.success && apiRes.data) {
    const { token, user } = apiRes.data;
    setAuthToken(token);
    saveStoredData(CURRENT_USER_KEY, user);
    return { success: true, user };
  }

  // If backend network error or offline, fallback to local accounts
  if (apiRes.isNetworkError) {
    const users = getRegisteredUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === password
    );

    if (found) {
      const userSession = { id: found.id, name: found.name, email: found.email };
      saveStoredData(CURRENT_USER_KEY, userSession);
      return { success: true, user: userSession };
    }
  }

  return { success: false, message: apiRes.message || 'Invalid email or password.' };
}

export async function registerUser(name, email, password) {
  // Try Backend MongoDB first
  const apiRes = await api.register(name, email, password);
  if (apiRes.success && apiRes.data) {
    const { token, user } = apiRes.data;
    setAuthToken(token);
    saveStoredData(CURRENT_USER_KEY, user);
    return { success: true, user };
  }

  // If backend network error or offline, fallback to local storage registration
  if (apiRes.isNetworkError) {
    const users = getRegisteredUsers();
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());

    if (exists) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: password
    };

    users.push(newUser);
    saveStoredData(USERS_KEY, users);

    const userSession = { id: newUser.id, name: newUser.name, email: newUser.email };
    saveStoredData(CURRENT_USER_KEY, userSession);

    return { success: true, user: userSession };
  }

  return { success: false, message: apiRes.message || 'Registration failed.' };
}

export function logoutUser() {
  setAuthToken('');
  localStorage.removeItem(CURRENT_USER_KEY);
}
