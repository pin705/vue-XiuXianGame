import { defineStore } from 'pinia';
import { ref } from 'vue';

const API_BASE = '/api';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('auth_token') || null);
  const user = ref(null);
  const isAuthenticated = ref(!!token.value);

  async function register(credentials) {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đăng ký thất bại');
      }

      token.value = data.data.token;
      user.value = data.data.user;
      isAuthenticated.value = true;
      localStorage.setItem('auth_token', data.data.token);

      return data;
    } catch (error) {
      throw error;
    }
  }

  async function login(credentials) {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }

      token.value = data.data.token;
      user.value = data.data.user;
      isAuthenticated.value = true;
      localStorage.setItem('auth_token', data.data.token);

      return data;
    } catch (error) {
      throw error;
    }
  }

  async function logout() {
    token.value = null;
    user.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem('auth_token');
  }

  async function fetchUser() {
    if (!token.value) return;

    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      if (!response.ok) {
        throw new Error('Phiên đăng nhập hết hạn');
      }

      const data = await response.json();
      user.value = data.data.user;
    } catch (error) {
      console.error('Fetch user error:', error);
      logout();
    }
  }

  function getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.value}`,
    };
  }

  return {
    token,
    user,
    isAuthenticated,
    register,
    login,
    logout,
    fetchUser,
    getAuthHeaders,
  };
});
