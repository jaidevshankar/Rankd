import * as React from 'react';
import { View, Text, ScrollView } from 'react-native';
import InputBox from '@/components/InputBox';
import TailwindTest from '@/components/TailwindTest';
import TailwindBasic from '@/components/TailwindBasic';
import StyledExample from '@/components/StyledExample';

export default function DevScreen() {
  return (
    <ScrollView>
      <View className="flex-1 items-center justify-center bg-white dark:bg-black p-4">
        <Text className="text-xl font-bold text-black dark:text-white mb-4">Dev Screen</Text>
        <Text className="text-blue-500 mb-2">This is where you can test your components</Text>
        <Text className="text-red-500 mb-4">Testing tests....</Text>
        
        <View className="bg-yellow-100 p-4 rounded-lg mb-4 w-full">
          <Text className="text-yellow-800">This should have a yellow background</Text>
        </View>
        
        <InputBox input="Test" name="Test" placeholder="Test input" />
        
       
      </View>
    </ScrollView>
  );
} 