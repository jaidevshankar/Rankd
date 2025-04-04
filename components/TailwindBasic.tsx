import React from 'react';
import { View, Text } from 'react-native';

export default function TailwindBasic() {
  return (
    <View style={{ width: '100%', marginVertical: 20 }}>
      <Text style={{ fontSize: 16, marginBottom: 8 }}>Regular Styles</Text>
      
      <View className="w-full h-20 bg-red-500 mb-4 rounded-lg">
        <Text className="text-white p-4 font-bold">Red Box with Tailwind</Text>
      </View>
      
      <View className="w-full h-20 bg-blue-500 mb-4 rounded-lg">
        <Text className="text-white p-4 font-bold">Blue Box with Tailwind</Text>
      </View>
      
      <View className="w-full h-20 bg-green-500 mb-4 rounded-lg">
        <Text className="text-white p-4 font-bold">Green Box with Tailwind</Text>
      </View>
    </View>
  );
} 