import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getSavedCities, deleteCity } from '../services/dbService';
import { getCoordinates, fetchWeather } from '../services/weatherService';

interface SavedWeather {
  id: number;
  name: string;
  temp: number | null;
}

export default function SavedLocations() {
  const [locations, setLocations] = useState<SavedWeather[]>([]);

  const loadData = async () => {
    const saved = await getSavedCities();
    const weatherData = await Promise.all(
      saved.map(async (city) => {
        const coords = await getCoordinates(city.name);
        if (coords) {
          const w = await fetchWeather(coords.lat, coords.lon);
          return { id: city.id, name: city.name, temp: w.temperature };
        }
        return { id: city.id, name: city.name, temp: null };
      })
    );
    setLocations(weatherData);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleRemove = async (id: number) => {
    await deleteCity(id);
    loadData(); // Refresh the list after deletion [cite: 25, 34]
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={locations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cityText}>{item.name}: {item.temp ?? '--'}°C</Text>
            <Button title="Remove" color="red" onPress={() => handleRemove(item.id)} />
          </View>
        )}
        ListEmptyComponent={<Text>No saved locations yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  card: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 15, 
    borderBottomWidth: 1,
    alignItems: 'center' 
  },
  cityText: { fontSize: 18 }
});