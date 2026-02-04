import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Platform, Linking, TouchableOpacity, AppState } from 'react-native';
import * as Location from 'expo-location';
import { fetchWeather } from '../services/weatherService';
import { SafeAreaView  } from 'react-native-safe-area-context';

export default function CurrentWeather() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [openedSettings, setOpenedSettings] = useState(false);

  const loadWeather = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      let lat = 44.6488; // Halifax default
      let lon = -63.5752; // Halifax default

      if (status === 'granted') {
        const pos = await Location.getCurrentPositionAsync({});
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
        setPermissionDenied(false);
      } else {
        setPermissionDenied(true);
        Alert.alert(
          'Location Permission',
          "We couldn't access your location. Showing weather for Halifax by default.",
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Enable Location in Settings',
              onPress: () => {
                setOpenedSettings(true);
                Linking.openSettings();
              },
            },
          ]
        );
      }

      const data = await fetchWeather(lat, lon);
      setWeather(data);
    } catch (e) {
      setPermissionDenied(true);
      Alert.alert(
        'Location Permission',
        "We couldn't access your location. Showing weather for Halifax by default.",
        [
          { text: 'OK' },
          {
            text: 'Enable Location in Settings',
            onPress: () => {
              setOpenedSettings(true);
              Linking.openSettings();
            },
          },
        ]
      );
      const data = await fetchWeather(44.6488, -63.5752);
      setWeather(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active' && openedSettings) {
        setLoading(true);
        loadWeather();
        setOpenedSettings(false);
      }
    });
    return () => sub.remove();
  }, [openedSettings]);

  return (
    <SafeAreaView  style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>HALIFAX, NS</Text>
        {permissionDenied && (
          <View style={styles.alertBox}>
            <Text style={styles.alertText}>
              We couldn't access your location. Showing weather for Halifax by default.
            </Text>
            {Platform.OS !== 'web' && (
              <TouchableOpacity
                style={styles.settingsBtn}
                onPress={() => {
                  setOpenedSettings(true);
                  Linking.openSettings();
                }}
              >
                <Text style={styles.settingsBtnText}>Enable Location in Settings</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.temp}>{Math.round(weather.temperature)}° C</Text>
            <Text style={styles.condition}>{weather.condition}</Text>
          </View>
        )}
      </View>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7', justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: '#FFFFFF',
    width: '85%',
    borderRadius: 35,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  label: { fontSize: 14, fontWeight: '700', color: '#8E8E93', letterSpacing: 1.5, marginBottom: 10 },
  alertBox: { backgroundColor: '#FFF4E5', borderRadius: 12, padding: 12, marginBottom: 16, width: '100%' },
  alertText: { color: '#8A6D3B', fontSize: 14, textAlign: 'center' },
  settingsBtn: { marginTop: 10, backgroundColor: '#007AFF', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, alignSelf: 'center' },
  settingsBtnText: { color: '#FFFFFF', fontWeight: '600' },
  temp: { fontSize: 90, fontWeight: '200', color: '#1C1C1E' },
  condition: { fontSize: 20, fontWeight: '500', color: '#3A3A3C' },
});