import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { MapViewComponent } from '../../components/map/map-view';
import { ReminderForm } from '../../components/reminder/reminder-form';
import { useReminders } from '../../hooks/use-reminders';
import { useLocation } from '../../hooks/use-location';
import { CreateReminderRequest } from '../../types';
import { COLORS } from '../../constants/colors';

export const CreateReminderScreen = ({ navigation }: any) => {
  const { create } = useReminders();
  const { latitude, longitude, getCurrentLocation } = useLocation();
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (!latitude || !longitude) {
      getCurrentLocation();
    }
  }, []);

  const handleMapPress = (lat: number, lng: number) => {
    setSelectedLocation({ latitude: lat, longitude: lng });
  };

  const handleSubmit = async (data: Omit<CreateReminderRequest, 'latitude' | 'longitude'>) => {
    if (!selectedLocation) {
      Alert.alert('Error', 'Please select a location on the map');
      return;
    }

    setLoading(true);
    try {
      await create({
        ...data,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      });
      Alert.alert('Success', 'Reminder created successfully');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create reminder');
    } finally {
      setLoading(false);
    }
  };

  if (!latitude || !longitude) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapViewComponent
          latitude={latitude}
          longitude={longitude}
          onMapPress={handleMapPress}
          selectedLocation={selectedLocation || undefined}
        />
      </View>
      <ScrollView style={styles.formContainer}>
        <ReminderForm onSubmit={handleSubmit} loading={loading} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mapContainer: {
    height: 300,
  },
  formContainer: {
    flex: 1,
  },
});