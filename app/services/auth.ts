import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use the same base URL configuration as the API service
const getBaseUrl = () => {
  // Use the host's IP address for all platforms in development
  if (__DEV__) {
    return 'http://10.193.129.73:8001';
  } else {
    // Production fallback
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:8001';
    } else if (Platform.OS === 'ios') {
      return 'http://localhost:8001';
    } else {
      return 'http://127.0.0.1:8001';
    }
  }
};

// For development, always use the explicit IP
const API_BASE_URL = __DEV__ ? 'http://10.193.129.73:8001' : getBaseUrl();

const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email_or_username: string;
  password: string;
}

export interface AuthResponse {
  user_id: number;
  username: string;
  email: string;
  message: string;
}

export interface UserData {
  user_id: number;
  username: string;
  email: string;
}

export const authService = {
  // Sign up a new user
  signup: async (data: SignupData): Promise<AuthResponse> => {
    try {
      console.log('Attempting signup with:', JSON.stringify(data));
      console.log('API URL:', `${API_BASE_URL}/auth/signup`);
      
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, data);
      console.log('Signup response:', JSON.stringify(response.data));
      
      // Store the user data
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify({
        user_id: response.data.user_id,
        username: response.data.username,
        email: response.data.email
      }));
      
      return response.data;
    } catch (error) {
      console.error('Error during signup:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Response data:', error.response.data);
      }
      throw error;
    }
  },

  // Log in a user
  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      console.log('Attempting login with:', JSON.stringify(data));
      console.log('API URL:', `${API_BASE_URL}/auth/login`);
      
      const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
      console.log('Login response:', JSON.stringify(response.data));
      
      // Store the user data
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify({
        user_id: response.data.user_id,
        username: response.data.username,
        email: response.data.email
      }));
      
      return response.data;
    } catch (error) {
      console.error('Error during login:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Response data:', error.response.data);
      }
      throw error;
    }
  },

  // Verify the user's token
  verifyToken: async (token: string): Promise<{ valid: boolean, user_id?: number, username?: string, email?: string }> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/verify_token`, { token });
      return response.data;
    } catch (error) {
      console.error('Error verifying token:', error);
      return { valid: false };
    }
  },

  // Check if the user is logged in
  checkAuth: async (): Promise<UserData | null> => {
    try {
      // Return the stored user data
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return null;
    }
  },

  // Log out the user
  logout: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(USER_DATA_KEY);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  },

  // Get the current authentication token
  getToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }
};

export default {}; 