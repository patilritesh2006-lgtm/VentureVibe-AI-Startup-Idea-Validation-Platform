import { api } from '@/lib/api';

export interface User {
  id: string;
  email: string;
  name: string | null;
  weeklySessionCount: number;
  weeklyResetAt: string;
}

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { accessToken, refreshToken, user } = response.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    return user;
  },

  register: async (email: string, password: string, name: string) => {
    const response = await api.post('/auth/register', { email, password, name });
    const { accessToken, refreshToken, user } = response.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    return user;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data.user;
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },
};
