import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from 'react-native';
import { AppDispatch, RootState } from '../store/store';
import {
  updateLocation,
  startTracking,
  stopTracking,
} from '../store/slices/location.slice';
import { locationService } from '../services/location-service';

export const useLocation = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { latitude, longitude, accuracy, tracking } = useSelector(
    (state: RootState) => state.location,
  );
  const [watchId, setWatchId] = useState<number | null>(null);

  const getCurrentLocation = async () => {
    try {
      const hasPermission = await locationService.requestPermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Location permission is required');
        throw new Error('Location permission denied');
      }

      const position = await locationService.getCurrentPosition();
      dispatch(updateLocation(position));
      return position;
    } catch (error) {
      console.error('Failed to get current location:', error);
      throw error;
    }
  };

  const startLocationTracking = async () => {
    const hasPermission = await locationService.requestPermission();
    if (!hasPermission) {
      throw new Error('Location permission denied');
    }

    const id = locationService.watchPosition(
      async (lat, lng, acc) => {
        dispatch(updateLocation({ latitude: lat, longitude: lng, accuracy: acc }));
        
        try {
          await locationService.updateLocationOnServer(lat, lng, acc);
        } catch (error) {
          console.error('Failed to update location on server:', error);
        }
      },
    );

    setWatchId(id);
    dispatch(startTracking());
  };

  const stopLocationTracking = () => {
    if (watchId !== null) {
      locationService.clearWatch(watchId);
      setWatchId(null);
    }
    dispatch(stopTracking());
  };

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        locationService.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return {
    latitude,
    longitude,
    accuracy,
    tracking,
    getCurrentLocation,
    startLocationTracking,
    stopLocationTracking,
  };
};