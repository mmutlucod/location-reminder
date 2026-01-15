import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { ReminderList } from '../../components/reminder/reminder-list';
import { useReminders } from '../../hooks/use-reminders';
import { useLocation } from '../../hooks/use-location';
import { Loading } from '../../components/common/loading';
import { Reminder } from '../../types';
import { COLORS } from '../../constants/colors';

export const RemindersScreen = ({ navigation }: any) => {
  const { reminders, loading, fetchAll, toggleActive } = useReminders();
  const { latitude, longitude } = useLocation();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAll();
    setRefreshing(false);
  };

  const handlePress = (reminder: Reminder) => {
    navigation.navigate('EditReminder', { reminderId: reminder.id });
  };

  const handleToggle = async (id: number, isActive: boolean) => {
    try {
      await toggleActive(id, isActive);
    } catch (error) {
      console.error('Failed to toggle reminder:', error);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateReminder')}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  if (loading && !refreshing) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <ReminderList
        reminders={reminders}
        currentLatitude={latitude || undefined}
        currentLongitude={longitude || undefined}
        onPress={handlePress}
        onToggle={handleToggle}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  addButton: {
    marginRight: 16,
    width: 30,
    height: 30,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: COLORS.surface,
    fontSize: 24,
    fontWeight: '600',
        lineHeight: 28,
    marginTop: -2,
  },
});