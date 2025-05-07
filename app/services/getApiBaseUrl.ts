import * as Network from 'expo-network';

let cachedBaseUrl: string | null = null;

export async function getApiBaseUrl(): Promise<string> {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;
  if (cachedBaseUrl) return cachedBaseUrl;
  const ip = await Network.getIpAddressAsync();
  cachedBaseUrl = `http://${ip}:8001`;
  return cachedBaseUrl;
} 