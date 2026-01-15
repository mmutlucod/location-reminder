import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../hooks/use-auth';
import { useLocation } from '../../hooks/use-location';
import { useReminders } from '../../hooks/use-reminders';
import { Button } from '../../components/common/button';
import { GradientButton } from '../../components/common/gradient-button';
import { Card } from '../../components/common/card';
import { COLORS } from '../../constants/colors';
import { fcmService } from '../../services/fcm-service';

export const HomeScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const { tracking, startLocationTracking, stopLocationTracking } = useLocation();
  const { reminders, fetchAll } = useReminders();

  useEffect(() => {
    fetchAll();
    initializeFCM();
  }, []);

  const initializeFCM = async () => {
    try {
      const hasPermission = await fcmService.requestPermission();
      if (hasPermission) {
        await fcmService.sendTokenToServer();
      }
    } catch (error) {
      console.error('FCM initialization failed:', error);
    }
  };

  const handleToggleTracking = async () => {
    try {
      if (tracking) {
        stopLocationTracking();
      } else {
        await startLocationTracking();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const activeReminders = reminders.filter(r => r.is_active).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hello, {user?.name}!</Text>
        <Text style={styles.subtitle}>Welcome to Location Reminder</Text>
      </View>

      <View style={styles.content}>
        <Card>
          <Text style={styles.cardTitle}>Location Tracking</Text>
          <Text style={styles.cardSubtitle}>
            {tracking ? 'Tracking is active' : 'Tracking is inactive'}
          </Text>
          <Button
            title={tracking ? 'Stop Tracking' : 'Start Tracking'}
            onPress={handleToggleTracking}
            variant={tracking ? 'danger' : 'primary'}
          />
        </Card>

        <Card>
          <Text style={styles.cardTitle}>Your Reminders</Text>
          <Text style={styles.statsText}>
            {activeReminders} active out of {reminders.length} total
          </Text>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate('Reminders')}>
            <Text style={styles.linkText}>View All Reminders →</Text>
          </TouchableOpacity>
        </Card>

        <Card>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <GradientButton
            title="Create New Reminder"
            onPress={() => navigation.navigate('CreateReminder')}
          />
          <View style={styles.spacing} />
          <Button
            title="View Map"
            onPress={() => navigation.navigate('Map')}
          />
        </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  coordinates: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 16,
    fontFamily: 'monospace',
  },
  statsText: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 12,
  },
  linkButton: {
    marginTop: 8,
  },
  linkText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  spacing: {
    height: 12,
  },
});