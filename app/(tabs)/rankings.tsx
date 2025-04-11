import { View, Text, StyleSheet } from 'react-native';

export default function RankingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Rankings Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
