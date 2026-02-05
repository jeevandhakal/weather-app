import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { getSavedLocations, deleteCity } from '../services/dbService';
import { fetchWeather, getCoordinates } from '../services/weatherService';
import { MaterialIcons } from '@expo/vector-icons';

export default function SavedLocations() {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused(); // Refresh data when tab is clicked

  const loadData = async () => {
    setLoading(true);
    const savedCities = await getSavedLocations();
    const weatherData = await Promise.all(savedCities.map(async (city) => {
        let lat = city.lat;
        let lon = city.lon;
        // If coordinates are missing, resolve by city name
        if (lat == null || lon == null) {
          const resolved = await getCoordinates(city.name);
          if (resolved) {
            lat = resolved.lat;
            lon = resolved.lon;
          }
        }
        if (lat == null || lon == null) {
          // Skip if still missing; return minimal info
          return { id: city.id, name: city.name, temp: NaN, condition: 'Unknown', windspeed: NaN, windDirectionCardinal: '—' };
        }
        const w = await fetchWeather(Number(lat), Number(lon));
        return {
          id: city.id,
          name: city.name,
          temp: w.temperature,
          condition: w.condition,
          windspeed: w.windspeed,
          windDirectionCardinal: w.windDirectionCardinal,
        };
      }));
    setLocations(weatherData);
    setLoading(false);
  };

  useEffect(() => { if (isFocused) loadData(); }, [isFocused]);

  const handleDelete = async (id: number) => {
    await deleteCity(id);
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
              <Text style={styles.cityTemp}>{isNaN(item.temp) ? '—' : `${Math.round(item.temp)}°C`}</Text>
              <Text style={styles.cityCondition}>{item.condition} • Wind {Math.round(item.windspeed)} km/h {item.windDirectionCardinal}</Text>
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
  cityCondition: { fontSize: 12, color: '#8E8E93', marginTop: 4 },
});