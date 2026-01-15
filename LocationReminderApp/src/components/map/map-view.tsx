import React, { useEffect, useRef } from 'react';
import { StyleSheet, Platform } from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import { Reminder } from '../../types';
import { COLORS } from '../../constants/colors';

interface MapViewComponentProps {
  latitude: number;
  longitude: number;
  reminders?: Reminder[];
  onMapPress?: (latitude: number, longitude: number) => void;
  selectedLocation?: { latitude: number; longitude: number };
}

export const MapViewComponent: React.FC<MapViewComponentProps> = ({
  latitude,
  longitude,
  reminders,
  onMapPress,
  selectedLocation,
}) => {
  const mapRef = useRef<MapView>(null);

  // 🔥 KONUM GELİNCE HARİTAYI ORAYA ANIMATE ET
  useEffect(() => {
    if (latitude && longitude && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  }, [latitude, longitude]);

  return (
    <MapView
      ref={mapRef}
      provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
      style={styles.map}
      initialRegion={{
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
      onPress={e => {
        if (onMapPress) {
          const { latitude: lat, longitude: lng } = e.nativeEvent.coordinate;
          onMapPress(lat, lng);
        }
      }}
    >
      {/* 📍 SENİN KONUMUN */}
      <Marker
        coordinate={{ latitude, longitude }}
        title="You are here"
        pinColor={COLORS.primary}
      />

      {/* 📌 SEÇİLEN KONUM */}
      {selectedLocation && (
        <Marker
          coordinate={selectedLocation}
          title="Selected Location"
          pinColor={COLORS.secondary}
        />
      )}

      {/* 🔔 REMINDER'LAR */}
      {reminders?.map(reminder => (
        <React.Fragment key={reminder.id}>
          <Marker
            coordinate={{
              latitude: reminder.latitude,
              longitude: reminder.longitude,
            }}
            title={reminder.title}
            description={reminder.description}
            pinColor={
              reminder.is_active ? COLORS.secondary : COLORS.disabled
            }
          />
          <Circle
            center={{
              latitude: reminder.latitude,
              longitude: reminder.longitude,
            }}
            radius={reminder.radius}
            strokeColor={COLORS.primary}
            fillColor={`${COLORS.primary}20`}
          />
        </React.Fragment>
      ))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
