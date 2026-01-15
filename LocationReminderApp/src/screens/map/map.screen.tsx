import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { MapViewComponent } from '../../components/map/map-view';
import { useLocation } from '../../hooks/use-location';
import { useReminders } from '../../hooks/use-reminders';
import { Loading } from '../../components/common/loading';

export const MapScreen = () => {
  const { latitude, longitude, getCurrentLocation } = useLocation();
  const { reminders, fetchAll } = useReminders();

  useEffect(() => {
    getCurrentLocation();
    fetchAll();
  }, []);

  if (!latitude || !longitude) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <MapViewComponent
        latitude={latitude}
        longitude={longitude}
        reminders={reminders}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});