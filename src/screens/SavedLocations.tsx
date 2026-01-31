import { View, Text, StyleSheet } from 'react-native';

export default function SavedLocations() {
  return (
    <View style={styles.container}>
      <Text>Saved Locations Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});