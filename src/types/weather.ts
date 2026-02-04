export interface WeatherData {
  temperature: number;
  condition: string;
  cityName: string;
}

export interface SavedLocation {
  id: number;
  name: string;
  lat: number;
  lon: number;
}