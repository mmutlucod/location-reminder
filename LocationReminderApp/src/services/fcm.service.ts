import messaging from '@react-native-firebase/messaging';
import { authApi } from '../api/auth.api';
import { PermissionsAndroid, Platform } from 'react-native';

export const fcmService = {
  requestPermission: async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    }

    const authStatus = await messaging().requestPermission();
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  },

  getToken: async (): Promise<string | null> => {
    try {
      const token = await messaging().getToken();
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  },

  sendTokenToServer: async (): Promise<void> => {
    const token = await fcmService.getToken();
    if (token) {
      await authApi.updateFCMToken(token);
    }
  },

  onTokenRefresh: (callback: (token: string) => void) => {
    return messaging().onTokenRefresh(callback);
  },

  onMessage: (callback: (message: any) => void) => {
    return messaging().onMessage(callback);
  },

  onNotificationOpenedApp: (callback: (message: any) => void) => {
    return messaging().onNotificationOpenedApp(callback);
  },

  getInitialNotification: async () => {
    return await messaging().getInitialNotification();
  },

  setBackgroundMessageHandler: (handler: (message: any) => Promise<void>) => {
    messaging().setBackgroundMessageHandler(handler);
  },
};