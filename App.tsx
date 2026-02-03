import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

import CurrentWeather from './src/screens/CurrentWeather';
import SearchWeather from './src/screens/SearchWeather';
import SavedLocations from './src/screens/SavedLocations';

import { initDatabase } from './src/services/dbService';


// Define the types for our tabs
export type RootTabParamList = {
  Current: undefined;
  Search: undefined;
  Saved: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  useEffect(() => {
    initDatabase(); // Create the table if it doesn't exist 
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName: any;
            if (route.name === 'Current') iconName = 'my-location';
            else if (route.name === 'Search') iconName = 'search';
            else iconName = 'history'; // Changed to 'history' for saved locations

            return <MaterialIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { height: 60, paddingBottom: 10 }
        })}
      >
        <Tab.Screen name="Current" component={CurrentWeather} />
        <Tab.Screen name="Search" component={SearchWeather} />
        <Tab.Screen name="Saved" component={SavedLocations} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}


