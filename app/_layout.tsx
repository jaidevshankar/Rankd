import React from 'react';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <Slot />
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </>
  );
}