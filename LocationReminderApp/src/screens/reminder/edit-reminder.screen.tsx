import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, TouchableOpacity, Text } from 'react-native';
import { MapViewComponent } from '../../components/map/map-view';
import { ReminderForm } from '../../components/reminder/reminder-form';
import { useReminders } from '../../hooks/use-reminders';
import { Loading } from '../../components/common/loading';
import { CreateReminderRequest } from '../../types';
import { COLORS } from '../../constants/colors';

export const EditReminderScreen = ({ route, navigation }: any) => {
  const { reminderId } = route.params;
  const { currentReminder, fetchById, update, remove } = useReminders();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchById(reminderId);
  }, [reminderId]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleSubmit = async (data: Omit<CreateReminderRequest, 'latitude' | 'longitude'>) => {
    setLoading(true);
    try {
      await update(reminderId, data);
      Alert.alert('Success', 'Reminder updated successfully');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update reminder');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await remove(reminderId);
              navigation.goBack();
            } catch (error: any) {
              Alert.alert('Error', 'Failed to delete reminder');
            }
          },
        },
      ],
    );
  };

  if (!currentReminder) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapViewComponent
          latitude={currentReminder.latitude}
          longitude={currentReminder.longitude}
          reminders={[currentReminder]}
        />
      </View>
      <ScrollView style={styles.formContainer}>
        <ReminderForm
          initialValues={{
            title: currentReminder.title,
            description: currentReminder.description,
            radius: currentReminder.radius,
            latitude: currentReminder.latitude,
            longitude: currentReminder.longitude,
          }}
          onSubmit={handleSubmit}
          loading={loading}
        />
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
  deleteButton: {
    marginRight: 16,
  },
  deleteText: {
    color: COLORS.error,
    fontSize: 16,
    fontWeight: '600',
  },
});