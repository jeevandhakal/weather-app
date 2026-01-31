import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { fetchWeather } from '../services/weatherService';

const CurrentWeather = () => {
  const [weather, setWeather] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      // 1. Request Permission 
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied. Showing Halifax weather.');
        // Fallback to Halifax coordinates as you are based there
        const data = await fetchWeather(44.6488, -63.5752); 
        setWeather(data);
        return;
      }

      // 2. Get Location 
      let location = await Location.getCurrentPositionAsync({});
      const data = await fetchWeather(location.coords.latitude, location.coords.longitude);
      setWeather(data);
    })();
  }, []);

  if (errorMsg && !weather) return <View><Text>{errorMsg}</Text></View>;
  if (!weather) return <ActivityIndicator size="large" />;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>Current Temp: {weather.temperature}°C</Text>
      {errorMsg && <Text style={{ color: 'red' }}>{errorMsg}</Text>}
    </View>
  );
};

export default CurrentWeather;