import { authAPI } from './api';

const setAuthData = (userData, token) => {
  localStorage.setItem('user', JSON.stringify(userData));
  // Backend AuthController sends: { success, message, username, userId, email, role }
  // It does NOT send a token. 
  // We will store a dummy token or rely on session if applicable. 
  // Since api.js checks for 'auth_token', we set a dummy one to pass the check if needed,
  // or we assume the backend doesn't enforce Bearer token verification for now.
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.setItem('auth_token', 'session-based-or-dummy');
  }
  localStorage.setItem('isAuthenticated', 'true');
};

const clearAuthData = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('isAuthenticated');
};

export const register = async (userData) => {
  try {
    // Generate username from email prefix if not provided
    const username = userData.username || userData.email.split('@')[0];

    const response = await authAPI.register({
      nama: userData.name,                    // Full name from form
      username: username,                      // Generate from email if not provided
      email: userData.email,
      password: userData.password,
      role: userData.role,
      noTelepon: userData.phone || '',
      alamat: userData.address || '-',
    });

    // Backend returns AuthResponse directly
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Registrasi gagal';
    throw new Error(message);
  }
};

export const login = async (email, password) => {
  try {
    const response = await authAPI.login({ usernameOrEmail: email, password });

    // AuthController returns AuthResponse { success, message, username, userId, email, role }
    const data = response.data;

    if (data.success === false) {
      throw new Error(data.message);
    }

    // Construct user object from response including profile data
    const user = {
      userId: data.userId,
      id: data.userId, // Alias for compatibility
      username: data.username,
      email: data.email,
      role: data.role,
      nama: data.nama || data.username, // Use nama from backend, fallback to username
      name: data.nama || data.username, // Alias for frontend compatibility
      fotoProfil: data.fotoProfil,      // Profile photo filename  
      photo: data.fotoProfil            // Alias for frontend compatibility
    }


    const token = null; // No token from backend

    setAuthData(user, token);

    return user;
  } catch (error) {
    const message = error.response?.data?.message || 'Login gagal';
    throw new Error(message);
  }
};

export const logout = async () => {
  try {
    // Backend doesn't seem to have explicit logout endpoint in AuthController
    // But we call it anyway if api.js has it, or just clear local state
    await authAPI.logout();
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    clearAuthData();
  }
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};