"use client";

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext'; // Corrected import path

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Keep for navigation to signup
  const { isDark } = useTheme();
  const { signIn } = useAuth(); // Get signIn from the AuthContext

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      // Simulate API call for login
      console.log('Attempting to sign in with:', email);
      // In a real app, you would await an API call here:
      // await actualLoginService(email, password);
      
      // Call signIn from AuthContext to update auth state
      signIn({ email: email, id: '123' }); // Pass some user data
      
      // Alert.alert('Success', 'Logged in successfully!');
      // Redirection is now handled by AuthProvider in contexts/AuthContext.tsx
      // No need for router.replace('/(tabs)/') here.

    } catch (error) {
      console.error('Login failed:', error);
      let errorMessage = 'Invalid email or password.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: isDark ? '#121212' : '#FFFFFF',
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 30,
      color: isDark ? '#FFFFFF' : '#000000',
    },
    input: {
      height: 50,
      borderColor: isDark ? '#555' : '#DDD',
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 15,
      paddingHorizontal: 15,
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#000000',
      backgroundColor: isDark ? '#1E1E1E' : '#F9F9F9',
    },
    button: {
      backgroundColor: '#FFD700',
      paddingVertical: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 15,
    },
    buttonText: {
      color: isDark ? '#1C1C1E' : '#000000',
      fontSize: 18,
      fontWeight: 'bold',
    },
    linkText: {
      color: '#FFD700',
      textAlign: 'center',
      fontSize: 16,
    },
    disabledButton: {
      backgroundColor: '#A9A9A9',
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email or Username"
        placeholderTextColor={isDark ? '#AAA' : '#999'}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={isDark ? '#AAA' : '#999'}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.disabledButton]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
} 