import React from 'react';
import { FlatList, Text, StyleSheet, View } from 'react-native';
import { ReminderCard } from './reminder-card';
import { Reminder } from '../../types';
import { COLORS } from '../../constants/colors';
import { calculateDistance } from '../../utils/distance';

interface ReminderListProps {
  reminders: Reminder[];
  currentLatitude?: number;
  currentLongitude?: number;
  onPress: (reminder: Reminder) => void;
  onToggle: (id: number, isActive: boolean) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export const ReminderList: React.FC<ReminderListProps> = ({
  reminders,
  currentLatitude,
  currentLongitude,
  onPress,
  onToggle,
  refreshing,
  onRefresh,
}) => {
  const getDistance = (reminder: Reminder) => {
    if (currentLatitude && currentLongitude) {
      return calculateDistance(
        currentLatitude,
        currentLongitude,
        reminder.latitude,
        reminder.longitude,
      );
    }
    return undefined;
  };

  if (reminders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No reminders yet</Text>
        <Text style={styles.emptySubtext}>Create your first location reminder</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={reminders}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <ReminderCard
          reminder={item}
          distance={getDistance(item)}
          onPress={() => onPress(item)}
          onToggle={isActive => onToggle(item.id, isActive)}
        />
      )}
      contentContainerStyle={styles.listContent}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});