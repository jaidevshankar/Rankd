import * as Network from 'expo-network';
import { Platform } from 'react-native';

let cachedBaseUrl: string | null = null;

// Export the async function as a named export
export async function getApiBaseUrl(): Promise<string> {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;
  if (cachedBaseUrl) return cachedBaseUrl;

  try {
    const ip = await Network.getIpAddressAsync();
    if (ip && ip !== '0.0.0.0') {
      cachedBaseUrl = `http://${ip}:8000`;
      return cachedBaseUrl;
    }
  } catch (error) {
    console.warn('Failed to get IP address:', error);
  }

  // Fallback URLs based on platform
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000';  // Android emulator
  } else if (Platform.OS === 'ios') {
    return 'http://localhost:8000';  // iOS simulator
  } else {
    return 'http://127.0.0.1:8000';  // Web or fallback
  }
}

// Export a synchronous function as default
export default function getBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;
  if (cachedBaseUrl) return cachedBaseUrl;

  // Fallback URLs based on platform
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000';  // Android emulator
  } else if (Platform.OS === 'ios') {
    return 'http://localhost:8000';  // iOS simulator
  } else {
    return 'http://127.0.0.1:8000';  // Web or fallback
  }
} 