import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '../common/card';
import { CustomSwitch } from '../common/custom-switch';
import { Reminder } from '../../types';
import { COLORS } from '../../constants/colors';
import { formatDistance } from '../../utils/distance';

interface ReminderCardProps {
  reminder: Reminder;
  onPress: () => void;
  onToggle: (isActive: boolean) => void;
  distance?: number;
}

export const ReminderCard: React.FC<ReminderCardProps> = ({
  reminder,
  onPress,
  onToggle,
  distance,
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{reminder.title}</Text>
            {distance !== undefined && (
              <Text style={styles.distance}>{formatDistance(distance)}</Text>
            )}
          </View>
          <CustomSwitch
            value={reminder.is_active}
            onValueChange={onToggle}
          />
        </View>
        {reminder.description && (
          <Text style={styles.description}>{reminder.description}</Text>
        )}
        <View style={styles.footer}>
          <Text style={styles.radius}>Radius: {formatDistance(reminder.radius)}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  distance: {
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  radius: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});