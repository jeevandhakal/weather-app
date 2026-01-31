import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { getCoordinates, fetchWeather } from '../services/weatherService';
import { saveCity } from '../services/dbService';

export default function SearchWeather() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState<any>(null);

  const handleSearch = async () => {
    const coords = await getCoordinates(query);
    if (coords) {
      const data = await fetchWeather(coords.lat, coords.lon);
      setWeather({ ...data, name: coords.name });
    }
  };

  const handleSave = async () => {
  const success = await saveCity(weather.name);
  if (success) {
    alert("Location saved!");
  } else {
    // This triggers if the limit of 5 is reached 
    alert("You cannot save more than 5 cities.");
  }
};

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.input} 
        placeholder="Enter city name..." 
        onChangeText={setQuery}
      />
      <Button title="Search" onPress={handleSearch} />
      
      {weather && (
        <View style={styles.result}>
          <Text>{weather.name}: {weather.temperature}°C</Text>
          {/* We will add the Save button in the next step */}
          <Button title="Save Location" onPress={handleSave} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderBottomWidth: 1, marginBottom: 10, padding: 8 },
  result: { marginTop: 20, alignItems: 'center' }
});