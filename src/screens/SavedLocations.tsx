import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { getSavedLocations, removeLocation } from '../services/dbService';
import { getCoordinates, fetchWeather } from '../services/weatherService';
import { MaterialIcons } from '@expo/vector-icons';

export default function SavedLocations() {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused(); // Refresh data when tab is clicked

  const loadData = async () => {
    setLoading(true);
    const savedCities = await getSavedLocations();
    const weatherData = await Promise.all(
      savedCities.map(async (city) => {
        const coords = await getCoordinates(city.name);
        if (coords) {
          const w = await fetchWeather(coords.lat, coords.lon);
          return { id: city.id, name: city.name, temp: w.temperature };
        }
        return null;
      })
    );
    setLocations(weatherData.filter(item => item !== null));
    setLoading(false);
  };

  useEffect(() => { if (isFocused) loadData(); }, [isFocused]);

  const handleDelete = async (id: number) => {
    await removeLocation(id);
    loadData(); // Refresh list after deletion
  };

  if (loading) return <ActivityIndicator style={{flex:1}} size="large" color="#007AFF" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite Cities</Text>
      <FlatList
        data={locations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cityCard}>
            <View>
              <Text style={styles.cityName}>{item.name}</Text>
              <Text style={styles.cityTemp}>{Math.round(item.temp)}°C</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <MaterialIcons name="delete-outline" size={24} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7', padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '800', color: '#1C1C1E', marginBottom: 20 },
  cityCard: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cityName: { fontSize: 18, fontWeight: '600', color: '#1C1C1E' },
  cityTemp: { fontSize: 22, fontWeight: '300', color: '#007AFF' },
});