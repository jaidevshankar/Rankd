import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TailwindTest() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Regular Style</Text>
      
      <View className="mt-4 p-4 bg-red-500 rounded-md">
        <Text className="text-white font-bold">Tailwind Style</Text>
      </View>
      
      <View style={{marginTop: 16, padding: 16, backgroundColor: 'blue', borderRadius: 6}}>
        <Text style={{color: 'white', fontWeight: 'bold'}}>Inline Style</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  }
}); 