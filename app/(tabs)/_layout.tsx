import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
      <View style={[styles.header, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
        <View style={styles.logoContainer}>
          <Text style={[styles.logoText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
            Rankd
          </Text>
        </View>
      </View>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#FFD700',
          tabBarInactiveTintColor: '#8E8E93',
          tabBarStyle: {
            borderTopWidth: 1,
            borderTopColor: isDark ? '#2C2C2E' : '#E5E5EA',
            height: 75,
            paddingBottom: 13,
            backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
          },
          tabBarLabelStyle: {
            fontSize: 12,
            marginTop: 3,
            color: isDark ? '#FFFFFF' : '#000000',
          },
          tabBarIconStyle: {
            marginTop: 6,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="friends"
          options={{
            title: 'Friends',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="rankings"
          options={{
            title: 'Rankings',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="list" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

