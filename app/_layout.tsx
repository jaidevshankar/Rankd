import React from 'react';
import { Stack } from 'expo-router'; // Slot might not be needed if AuthProvider handles routing logic
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { AuthProvider, useAuth } from '../contexts/AuthContext'; // Import from the new context file
import { View, StyleSheet, ActivityIndicator } from 'react-native';

// RootLayoutNav now primarily defines the stack structure.
// The routing logic (redirects) is handled by AuthProvider.
function RootLayoutNav() {
  const { isLoading, user } = useAuth(); // Get isLoading state

  // Optional: Show a loading spinner while AuthProvider is checking the auth state.
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* The screens available depend on the auth state, 
          but AuthProvider handles the redirection. 
          So we can list all top-level navigators here. */}
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="search" options={{ presentation: 'modal' }} />
      <Stack.Screen name="comparison" options={{ presentation: 'card' }} />
      <Stack.Screen name="friend-rankings" options={{ presentation: 'card' }} />
    </Stack>
  );
}

function RootLayoutContent() {
  const { isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
      <RootLayoutNav />
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>      {/* AuthProvider now wraps ThemeProvider and everything else */}
      <ThemeProvider>
        <RootLayoutContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});