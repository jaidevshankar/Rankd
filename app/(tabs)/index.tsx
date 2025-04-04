import * as React from 'react';
import { View, Text, Button, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Link } from 'expo-router';

// android 581952459071-5qu3okl64f4a5sc0lhlpsbvofi4buf47.apps.googleusercontent.com
// ios 581952459071-s31vnkaf7ue14uhqghdotsp8e3hchqki.apps.googleusercontent.com

export default function HomeScreen() {
  const router = useRouter();
  const [userInfo, setUserInfo] = React.useState(null);
  // ... existing code ...

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-white dark:bg-gray-900">
      <Text className="text-2xl font-bold text-black dark:text-white">Home</Text>
      
      <Pressable 
        className="bg-blue-500 py-3 px-6 rounded-lg"
        onPress={() => {
          // @ts-ignore - Type safety bypass for navigation
          router.push('dev');
        }}
      >
        <Text className="text-white font-semibold">Go to Dev Screen</Text>
      </Pressable>
    </View>
  );
}