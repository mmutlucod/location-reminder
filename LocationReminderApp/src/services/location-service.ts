import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid, Platform } from 'react-native';
import { locationApi } from '../api/location.api';

export const locationService = {
  requestPermission: async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  },

  getCurrentPosition: (): Promise<{
    latitude: number;
    longitude: number;
    accuracy: number;
  }> => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        error => reject(error),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    });
  },

  watchPosition: (
    callback: (latitude: number, longitude: number, accuracy: number) => void,
  ): number => {
    return Geolocation.watchPosition(
      position => {
        callback(
          position.coords.latitude,
          position.coords.longitude,
          position.coords.accuracy,
        );
      },
      error => console.error('Watch position error:', error),
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
        interval: 10000,
        fastestInterval: 5000,
      },
    );
  },

  clearWatch: (watchId: number) => {
    Geolocation.clearWatch(watchId);
  },

  updateLocationOnServer: async (
    latitude: number,
    longitude: number,
    accuracy?: number,
  ) => {
    try {
      const response = await locationApi.updateLocation(
        latitude,
        longitude,
        accuracy,
      );
      return response;
    } catch (error) {
      console.error('Failed to update location on server:', error);
      throw error;
    }
  },
};