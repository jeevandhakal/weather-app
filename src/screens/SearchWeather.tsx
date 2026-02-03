import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { getCoordinates, fetchWeather } from '../services/weatherService';
import { saveCity } from '../services/dbService';
import { Ionicons } from '@expo/vector-icons';

export default function SearchWeather() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    Keyboard.dismiss();
    const coords = await getCoordinates(query);
    if (coords) {
      const data = await fetchWeather(coords.lat, coords.lon);
      setWeather({ ...data, name: coords.name });
    } 
    setLoading(false);
  };

  const clearSearch = () => {
    setQuery('');
    setWeather(null);
  };

  const handleSave = async () => {
    const success = await saveCity(weather.name);
    if (success) alert(`${weather.name} saved to favorites!`);
  };


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.searchSection}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Search city (e.g. Tokyo)"
              placeholderTextColor="#8E8E93"
              value={query}
              onChangeText={setQuery}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={clearSearch} style={styles.clearIcon}>
                <Ionicons name="close-circle" size={20} color="#C7C7CC" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {loading && <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 50 }} />}

        {weather && !loading && (
          <View style={styles.resultCard}>
            <Text style={styles.cityName}>{weather.name.toUpperCase()}</Text>
            <Text style={styles.temp}>{Math.round(weather.temperature)}°C</Text>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>SAVE TO FAVORITES</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    padding: 20,
    paddingTop: 60
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'stretch', // Ensures button and input have same height
    marginBottom: 30,
    height: 55, // Fixed height for the row
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 15,
    paddingRight: 10,
    // Shadow only on the wrapper
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#1C1C1E',
    height: '100%',
    // Removed duplicate background and shadows from here
  },
  clearIcon: {
    padding: 5,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: 15,
    marginLeft: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600'
  },
  resultCard: {
    backgroundColor: '#FFF',
    borderRadius: 30,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  cityName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 2
  },
  temp: {
    fontSize: 70,
    fontWeight: '200',
    color: '#1C1C1E',
    marginVertical: 10
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#E5E5EA',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  saveButtonText: {
    color: '#007AFF',
    fontWeight: '700',
    fontSize: 12
  },
});