import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { authApi } from '../api/auth.api';
import { PermissionsAndroid, Platform } from 'react-native';

async function displayNotification(remoteMessage: any) {
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
    sound: 'default',
  });

  const title = remoteMessage.data?.title || remoteMessage.notification?.title || 'Yeni Bildirim';
  const body = remoteMessage.data?.body || remoteMessage.notification?.body || '';

  await notifee.displayNotification({
    title: title,
    body: body,
    data: remoteMessage.data,
    android: {
      channelId,
      importance: AndroidImportance.HIGH,
      pressAction: {
        id: 'default',
      },
      sound: 'default',
    },
    ios: {
      sound: 'default',
      foregroundPresentationOptions: {
        alert: true,
        badge: true,
        sound: true,
      },
    },
  });
}

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background message:', remoteMessage);
  await displayNotification(remoteMessage);
});

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
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      await messaging().registerDeviceForRemoteMessages();
    }

    return enabled;
  },

  getToken: async (): Promise<string | null> => {
    try {
      if (Platform.OS === 'ios') {
        const isRegistered = messaging().isDeviceRegisteredForRemoteMessages;
        if (!isRegistered) {
          await messaging().registerDeviceForRemoteMessages();
        }
      }
      
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

  setupNotificationListeners: () => {
    const foregroundUnsubscribe = fcmService.onMessage(async message => {
      console.log('Foreground message:', message);
      await displayNotification(message);
    });

    fcmService.onNotificationOpenedApp(message => {
      console.log('Notification opened app:', message);
    });

    fcmService.getInitialNotification().then(message => {
      if (message) {
        console.log('App opened from notification:', message);
      }
    });

    const notifeeUnsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log('Notification pressed:', detail.notification);
      }
    });

    return () => {
      foregroundUnsubscribe();
      notifeeUnsubscribe();
    };
  },
};