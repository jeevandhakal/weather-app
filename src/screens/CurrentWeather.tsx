import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { fetchWeather } from '../services/weatherService';
import { SafeAreaView  } from 'react-native-safe-area-context';

export default function CurrentWeather() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      const lat = status === 'granted' ? (await Location.getCurrentPositionAsync({})).coords.latitude : 44.6488;
      const lon = status === 'granted' ? (await Location.getCurrentPositionAsync({})).coords.longitude : -63.5752;
      
      const data = await fetchWeather(lat, lon);
      setWeather(data);
      setLoading(false);
    })();
  }, []);

  return (
    <SafeAreaView  style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>HALIFAX, NS</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.temp}>{Math.round(weather.temperature)}°</Text>
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
  temp: { fontSize: 90, fontWeight: '200', color: '#1C1C1E' },
  condition: { fontSize: 20, fontWeight: '500', color: '#3A3A3C' },
});