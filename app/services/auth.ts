import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiBaseUrl } from './getApiBaseUrl';

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
      const baseUrl = await getApiBaseUrl();
      console.log('API URL:', `${baseUrl}/auth/signup`);
      const response = await axios.post(`${baseUrl}/auth/signup`, data);
      console.log('Signup response:', JSON.stringify(response.data));
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
      const baseUrl = await getApiBaseUrl();
      console.log('API URL:', `${baseUrl}/auth/login`);
      const response = await axios.post(`${baseUrl}/auth/login`, data);
      console.log('Login response:', JSON.stringify(response.data));
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