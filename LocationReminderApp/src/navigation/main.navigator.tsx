import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { HomeScreen } from '../screens/home/home.screen';
import { RemindersScreen } from '../screens/reminder/reminders.screen';
import { CreateReminderScreen } from '../screens/reminder/create-reminder.screen';
import { EditReminderScreen } from '../screens/reminder/edit-reminder.screen';
import { MapScreen } from '../screens/map/map.screen';
import { ProfileScreen } from '../screens/profile/profile.screen';
import { COLORS } from '../constants/colors';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="HomeMain"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="CreateReminder"
      component={CreateReminderScreen}
      options={{ title: 'Create Reminder' }}
    />
  </Stack.Navigator>
);

const RemindersStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="RemindersList"
      component={RemindersScreen}
      options={{ title: 'My Reminders' }}
    />
<Stack.Screen
  name="CreateReminder"
  component={CreateReminderScreen}
  options={({ navigation }) => ({
    title: 'Create Reminder',
    headerBackVisible: false,
    headerLeft: () => (
      <Icon
        name="chevron-back"
        size={28}
        color="#000"
        style={{ marginLeft: 12 }}
        onPress={() => navigation.goBack()}
      />
    ),
  })}
/>


    <Stack.Screen
      name="EditReminder"
      component={EditReminderScreen}
        options={({ navigation }) => ({
        title: 'Edit Reminder',
        headerBackVisible: false,
        headerLeft: () => (
          <Icon
            name="chevron-back"
            size={28}
            color="#000"
            style={{ marginLeft: 12 }}
            onPress={() => navigation.goBack()}
          />
        ),
      })}
    />
  </Stack.Navigator>
);

const MapStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="MapMain"
      component={MapScreen}
      options={{ title: 'Map' }}
    />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="ProfileMain"
      component={ProfileScreen}
      options={{ title: 'Profile' }}
    />
  </Stack.Navigator>
);

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Reminders"
        component={RemindersStack}
        options={{
          tabBarLabel: 'Reminders',
          tabBarIcon: ({ color, size }) => (
            <Icon name="notifications-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapStack}
        options={{
          tabBarLabel: 'Map',
          tabBarIcon: ({ color, size }) => (
            <Icon name="map-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Icon name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};