import { View, Text, StyleSheet } from 'react-native';

export default function SearchWeather() {
  return (
    <View style={styles.container}>
      <Text>Search Weather Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});