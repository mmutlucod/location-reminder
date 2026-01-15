import apiClient from './client';
import { Reminder, CreateReminderRequest } from '../types';

export const reminderApi = {
  getAll: async (): Promise<Reminder[]> => {
    const response = await apiClient.get('/reminders');
    return response.data.data;
  },

  getById: async (id: number): Promise<Reminder> => {
    const response = await apiClient.get(`/reminders/${id}`);
    return response.data.data;
  },

  create: async (data: CreateReminderRequest): Promise<Reminder> => {
    const response = await apiClient.post('/reminders', data);
    return response.data.data;
  },

  update: async (id: number, data: Partial<CreateReminderRequest>): Promise<Reminder> => {
    const response = await apiClient.put(`/reminders/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/reminders/${id}`);
  },

  toggleActive: async (id: number, isActive: boolean): Promise<Reminder> => {
    const response = await apiClient.put(`/reminders/${id}`, { is_active: isActive });
    return response.data.data;
  },
};