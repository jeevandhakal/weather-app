import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import your screens
import CurrentWeather from './src/screens/CurrentWeather';
import SearchWeather from './src/screens/SearchWeather';
import SavedLocations from './src/screens/SavedLocations';

// Define the types for our tabs
export type RootTabParamList = {
  Current: undefined;
  Search: undefined;
  Saved: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: true }}>
        <Tab.Screen name="Current" component={CurrentWeather} />
        <Tab.Screen name="Search" component={SearchWeather} />
        <Tab.Screen name="Saved" component={SavedLocations} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}