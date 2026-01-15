import apiClient from './client';
import { LocationLog, Reminder } from '../types';

interface UpdateLocationResponse {
  triggered_reminders: Reminder[];
  location_logged: boolean;
}

export const locationApi = {
  updateLocation: async (
    latitude: number,
    longitude: number,
    accuracy?: number,
  ): Promise<UpdateLocationResponse> => {
    const response = await apiClient.post('/location/update', {
      latitude,
      longitude,
      accuracy,
    });
    return response.data.data;
  },

  getHistory: async (): Promise<LocationLog[]> => {
    const response = await apiClient.get('/location/history');
    return response.data.data;
  },
};