import apiClient from './client';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../types';

export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get('/profile');
    return response.data.data;
  },

  updateFCMToken: async (fcmToken: string): Promise<void> => {
    await apiClient.put('/fcm-token', { fcm_token: fcmToken });
  },
};