"use client";

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext'; // Assuming ThemeContext is accessible
// import { authService } from '../services/api'; // Placeholder for auth service

export default function SignupScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isDark } = useTheme(); // Assuming you have a ThemeContext

  const handleSignup = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      // Placeholder for actual signup logic
      // const user = await authService.signup(username, email, password);
      // console.log('Signed up user:', user);
      Alert.alert('Success', 'Account created successfully! Please log in.');
      router.replace('/(auth)/login'); // Navigate to login screen after signup
    } catch (error) {
      console.error('Signup failed:', error);
      Alert.alert('Signup Failed', 'Could not create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reusing and adapting styles from LoginScreen for consistency
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
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor={isDark ? '#AAA' : '#999'}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
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
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor={isDark ? '#AAA' : '#999'}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.disabledButton]}
        onPress={handleSignup}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Creating Account...' : 'Sign Up'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
} 