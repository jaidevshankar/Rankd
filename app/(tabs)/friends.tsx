import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import FriendList from '../components/FriendList';

export default function FriendsScreen() {
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();

  // In a real app, we'd get the user ID from authentication
  // For now, we'll use a fixed user ID 
  const userId = 1;

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
      <View style={[styles.header, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF', borderBottomColor: isDark ? '#2C2C2E' : '#E5E5EA' }]}>
        <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#000000' }]}>Friends</Text>
      </View>
      <FriendList userId={userId} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    paddingTop: 48,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

