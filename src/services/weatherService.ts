export const fetchWeather = async (lat: number, lon: number) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
  const response = await fetch(url);
  const data = await response.json();
  return data.current_weather;
};